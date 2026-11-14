import { ObjectId } from 'mongodb';
import {
  toE164BR,
  type FilePurpose,
  type MaintenanceRequestCategory,
  type PaymentReceiptDTO,
  type WhaplyEventEnvelope,
  type whatsappMaintenanceParts,
} from '@yudirect/contracts';
import type { AppContext } from '../context.js';
import type { DriverDoc, OrganizationDoc, PaymentReceiptDoc, RentalDoc } from '../database/types.js';
import { notFound } from '../common/errors.js';
import { sha256Hex } from '../integrations/whaply/signing.js';
import { audit } from './common.js';
import { insertMaintenanceRequest } from './driver-portal.js';
import { describeFiles, storeFile } from './files.js';
import { createNotification } from './notifications.js';

/* ------------------------------------------------------------------ *
 * Mensagens da LOCADORA vindas do WhatsApp (Whaply), fora da vistoria:
 *  - `maintenance.requested`: chamado aberto no menu Manutenção → pedido de manutenção;
 *  - `payment.receipt_received`: comprovante enviado no menu Financeiro → comprovante pendente
 *    de conferência (a baixa continua manual, feita pelo dono).
 *
 * Locadora: a dona do canal (WHAPLY_ORGANIZATION_ID ou, sem ela, a única com a coleta pelo
 * WhatsApp ligada). Motorista: pelo telefone, dentro dessa locadora. Nada é associado por
 * palpite: sem locadora certa, o evento é ignorado; sem motorista, vira alerta.
 * ------------------------------------------------------------------ */

export type LocadoraOutcome = 'processed' | 'ignored';

type MediaRef = { mediaRef: string; sha256: string; mimeType: string; size: number; wamid: string };
type MaintenanceData = {
  contactPhoneE164: string;
  part: (typeof whatsappMaintenanceParts)[number];
  partLabel: string;
  description: string;
  media: MediaRef[];
};
type ReceiptData = MediaRef & { contactPhoneE164: string; caption?: string };

const PART_CATEGORY: Record<MaintenanceData['part'], MaintenanceRequestCategory> = {
  freios: 'MECHANICAL',
  motor: 'MECHANICAL',
  pneus: 'TIRES',
  eletrica: 'ELECTRICAL',
  outro: 'OTHER',
};

/** Locadora dona do canal Whaply. */
export async function resolveChannelOrganization(ctx: AppContext): Promise<OrganizationDoc | null> {
  const c = ctx.mongo.collections;
  if (ctx.env.WHAPLY_ORGANIZATION_ID) {
    return c.organizations.findOne({ _id: new ObjectId(ctx.env.WHAPLY_ORGANIZATION_ID) });
  }
  const enabled = await c.organizations.find({ 'settings.inspectionWhatsapp.enabled': true }).limit(2).toArray();
  return enabled.length === 1 ? enabled[0]! : null;
}

/**
 * Telefones do cadastro (só dígitos nacionais) que correspondem ao número do WhatsApp. O WhatsApp
 * às vezes entrega celular brasileiro sem o nono dígito; os dois formatos são aceitos.
 */
export function phoneCandidates(phoneE164: string): string[] {
  const e164 = toE164BR(phoneE164);
  if (!e164) return [];
  const national = e164.slice(3);
  const out = new Set([national]);
  if (national.length === 10 && /^[6-9]$/.test(national[2]!)) out.add(`${national.slice(0, 2)}9${national.slice(2)}`);
  if (national.length === 11 && national[2] === '9') out.add(`${national.slice(0, 2)}${national.slice(3)}`);
  return [...out];
}

/** Motorista (não arquivado) com esse telefone; prefere quem tem locação ativa. */
export async function findDriverByPhone(
  ctx: AppContext,
  organizationId: ObjectId,
  phoneE164: string,
): Promise<{ driver: DriverDoc; rental: RentalDoc | null } | null> {
  const c = ctx.mongo.collections;
  const candidates = phoneCandidates(phoneE164);
  if (candidates.length === 0) return null;
  const drivers = await c.drivers.find({ organizationId, phone: { $in: candidates }, archivedAt: null }).limit(5).toArray();
  if (drivers.length === 0) return null;
  for (const driver of drivers) {
    const rental = await c.rentals.findOne({ organizationId, driverId: driver._id, status: 'ACTIVE' }, { sort: { startDate: -1 } });
    if (rental) return { driver, rental };
  }
  return drivers.length === 1 ? { driver: drivers[0]!, rental: null } : null;
}

/** Busca a mídia no Whaply e guarda; `null` = não foi possível (falha permanente). */
async function pullMedia(
  ctx: AppContext,
  organizationId: ObjectId,
  media: MediaRef,
  purpose: FilePurpose,
  name: string,
): Promise<ObjectId | null> {
  const res = await ctx.integrations.whaply.fetchMedia(media.mediaRef);
  if (!res.ok) {
    if (res.retryable) throw new Error(`Mídia indisponível no momento: ${res.message}`);
    return null;
  }
  if (sha256Hex(res.data.buffer) !== media.sha256) return null;
  try {
    const stored = await storeFile(ctx, {
      organizationId,
      uploadedBy: null,
      purpose,
      originalName: `${name}-${media.wamid.slice(-12)}.${media.mimeType.split('/')[1] ?? 'bin'}`,
      declaredContentType: media.mimeType,
      buffer: res.data.buffer,
    });
    return stored.id;
  } catch {
    return null;
  }
}

async function unknownSender(ctx: AppContext, org: OrganizationDoc, envelope: WhaplyEventEnvelope, phone: string, what: string): Promise<void> {
  await createNotification(ctx, {
    organizationId: org._id,
    type: what === 'manutenção' ? 'MAINTENANCE' : 'BILLING',
    severity: 'WARNING',
    title: `WhatsApp: ${what} de número desconhecido`,
    message: `O número ${phone} enviou ${what === 'manutenção' ? 'um chamado de manutenção' : 'um comprovante'} pelo WhatsApp, mas não há motorista com esse telefone. Confira o cadastro.`,
    subjectLabel: phone,
    entityType: null,
    entityId: null,
    targetPath: '/dashboard/drivers',
    dedupeKey: `wa-unknown:${envelope.eventId}`,
  });
}

/* ------------------- comprovantes na aba Pagamentos ------------------- */

export async function listRentalReceipts(ctx: AppContext, organizationId: ObjectId, rentalId: ObjectId): Promise<PaymentReceiptDTO[]> {
  const docs = await ctx.mongo.collections.paymentReceipts
    .find({ organizationId, rentalId })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  const files = await describeFiles(ctx, organizationId, docs.map((d) => d.fileId));
  return docs.map((d) => {
    const f = files.get(d.fileId.toHexString());
    return {
      id: d._id.toHexString(),
      source: d.source,
      status: d.status,
      caption: d.caption,
      senderPhone: d.senderPhone,
      file: f ? { url: f.url, name: f.originalName, contentType: f.contentType } : null,
      receivedAt: d.createdAt.toISOString(),
      reviewedAt: d.reviewedAt ? d.reviewedAt.toISOString() : null,
    };
  });
}

/** O dono conferiu o comprovante (a baixa em si continua sendo feita no pagamento, como antes). */
export async function markReceiptReviewed(
  ctx: AppContext,
  params: { organizationId: ObjectId; rentalId: ObjectId; receiptId: ObjectId; actorId: ObjectId },
): Promise<void> {
  const now = new Date();
  const res = await ctx.mongo.collections.paymentReceipts.updateOne(
    { _id: params.receiptId, organizationId: params.organizationId, rentalId: params.rentalId, status: 'PENDING_REVIEW' },
    { $set: { status: 'REVIEWED', reviewedBy: params.actorId, reviewedAt: now, updatedAt: now } },
  );
  if (res.matchedCount === 0) {
    const exists = await ctx.mongo.collections.paymentReceipts.countDocuments({ _id: params.receiptId, organizationId: params.organizationId, rentalId: params.rentalId });
    if (exists === 0) throw notFound('Comprovante não encontrado.');
    return; // já conferido: idempotente
  }
  await audit(ctx, {
    organizationId: params.organizationId,
    actorId: params.actorId,
    action: 'paymentReceipt.reviewed',
    entityType: 'paymentReceipt',
    entityId: params.receiptId,
    after: { status: 'REVIEWED' },
  });
}

export async function handleMaintenanceRequested(
  ctx: AppContext,
  envelope: WhaplyEventEnvelope,
  data: MaintenanceData,
): Promise<LocadoraOutcome> {
  const c = ctx.mongo.collections;
  if (await c.maintenanceRequests.findOne({ sourceEventId: envelope.eventId })) return 'processed';
  const org = await resolveChannelOrganization(ctx);
  if (!org) return 'ignored';
  const found = await findDriverByPhone(ctx, org._id, data.contactPhoneE164);
  if (!found?.rental) {
    await unknownSender(ctx, org, envelope, data.contactPhoneE164, 'manutenção');
    return 'processed';
  }

  const photos: ObjectId[] = [];
  for (const media of data.media) {
    const id = await pullMedia(ctx, org._id, media, 'MAINTENANCE_REQUEST_PHOTO', 'whatsapp-manutencao');
    if (id) photos.push(id);
  }
  const lost = data.media.length - photos.length;
  try {
    await insertMaintenanceRequest(ctx, {
      organizationId: org._id,
      driverId: found.driver._id,
      driverName: found.driver.fullName,
      rental: found.rental,
      category: PART_CATEGORY[data.part],
      description: `${data.partLabel}: ${data.description}${lost > 0 ? ` (${lost} foto(s) não puderam ser recebidas)` : ''}`.slice(0, 1000),
      vehicleStopped: false,
      photoFileIds: photos,
      auditAction: 'whatsapp.maintenanceRequest',
      sourceEventId: envelope.eventId,
    });
  } catch (err) {
    // Reprocessamento concorrente do mesmo evento: o índice único garante um pedido só.
    if ((err as { code?: number }).code !== 11000) throw err;
  }
  return 'processed';
}

export async function handleReceiptReceived(
  ctx: AppContext,
  envelope: WhaplyEventEnvelope,
  data: ReceiptData,
): Promise<LocadoraOutcome> {
  const c = ctx.mongo.collections;
  if (await c.paymentReceipts.findOne({ eventId: envelope.eventId })) return 'processed';
  const org = await resolveChannelOrganization(ctx);
  if (!org) return 'ignored';
  const found = await findDriverByPhone(ctx, org._id, data.contactPhoneE164);

  const fileId = await pullMedia(ctx, org._id, data, 'PAYMENT_RECEIPT', 'whatsapp-comprovante');
  if (!fileId) {
    await createNotification(ctx, {
      organizationId: org._id,
      type: 'BILLING',
      severity: 'WARNING',
      title: 'WhatsApp: comprovante não pôde ser recebido',
      message: `${found?.driver.fullName ?? data.contactPhoneE164} enviou um comprovante pelo WhatsApp, mas o arquivo não pôde ser obtido. Peça para reenviar.`,
      subjectLabel: found?.driver.fullName ?? data.contactPhoneE164,
      entityType: found?.rental ? 'rental' : null,
      entityId: found?.rental?._id ?? null,
      targetPath: found?.rental ? `/dashboard/rentals/${found.rental._id.toHexString()}?tab=payments` : '/dashboard/rentals',
      dedupeKey: `wa-receipt-lost:${envelope.eventId}`,
    });
    return 'processed';
  }

  const now = new Date();
  const doc: PaymentReceiptDoc = {
    _id: new ObjectId(),
    organizationId: org._id,
    driverId: found?.driver._id ?? null,
    rentalId: found?.rental?._id ?? null,
    fileId,
    source: 'WHATSAPP',
    eventId: envelope.eventId,
    wamid: data.wamid,
    sha256: data.sha256,
    caption: data.caption?.trim() ? data.caption.trim().slice(0, 500) : null,
    senderPhone: data.contactPhoneE164,
    status: 'PENDING_REVIEW',
    reviewedBy: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await c.paymentReceipts.insertOne(doc);
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return 'processed';
    throw err;
  }
  if (!found) {
    await unknownSender(ctx, org, envelope, data.contactPhoneE164, 'comprovante');
  } else {
    await createNotification(ctx, {
      organizationId: org._id,
      type: 'BILLING',
      severity: 'INFO',
      title: 'Comprovante recebido pelo WhatsApp',
      message: `${found.driver.fullName} enviou um comprovante de pagamento. Confira e dê a baixa na aba Pagamentos.`,
      subjectLabel: found.driver.fullName,
      entityType: found.rental ? 'rental' : 'driver',
      entityId: found.rental?._id ?? found.driver._id,
      targetPath: found.rental ? `/dashboard/rentals/${found.rental._id.toHexString()}?tab=payments` : '/dashboard/drivers',
      dedupeKey: `wa-receipt:${envelope.eventId}`,
    });
  }
  await audit(ctx, {
    organizationId: org._id,
    actorId: null,
    action: 'whatsapp.paymentReceipt',
    entityType: 'paymentReceipt',
    entityId: doc._id,
    after: { driverId: doc.driverId, rentalId: doc.rentalId },
  });
  return 'processed';
}
