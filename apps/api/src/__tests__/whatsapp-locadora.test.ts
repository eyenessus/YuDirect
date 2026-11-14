import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ObjectId } from 'mongodb';
import { fullMatrix } from '@yudirect/contracts';
import { createHarness, sessionCookie, type TestHarness } from '../testing/harness.js';
import { FakeWhaply, tinyPng } from '../testing/fake-whaply.js';
import { hashPassword } from '../common/helpers.js';
import { phoneCandidates } from '../services/whatsapp-locadora.js';

/* ------------------------------------------------------------------ *
 * Menu da locadora no WhatsApp → YuDirect (fora da vistoria):
 *  - `maintenance.requested` vira pedido de manutenção do motorista;
 *  - `payment.receipt_received` vira comprovante pendente de conferência na aba Pagamentos.
 * O Whaply é o simulador do contrato (assinatura HMAC real, mídia por referência).
 * ------------------------------------------------------------------ */

const PDF = Buffer.from('%PDF-1.7\n1 0 obj << >> endobj\n%%EOF\n');

describe('WhatsApp da locadora: manutenção e comprovante', () => {
  const fake = new FakeWhaply();
  let harness: TestHarness;
  let cookie: string;
  let organizationId: ObjectId;
  let counter = 0;

  const req = (c: string) => ({
    get: (url: string) => harness.app.inject({ method: 'GET', url, headers: { cookie: c } }),
    post: (url: string, payload?: unknown) => harness.app.inject({ method: 'POST', url, headers: { cookie: c }, payload: payload as never }),
  });

  async function rentedDriver(phone: string) {
    counter += 1;
    const plate = `LOC${counter}A${String(counter).padStart(2, '0')}`;
    const vehicle = await req(cookie).post('/api/v1/vehicles', { plate, brand: 'Fiat', model: 'Mobi' });
    expect(vehicle.statusCode, vehicle.body).toBe(201);
    const driver = await req(cookie).post('/api/v1/drivers', { fullName: `Motorista ${counter}`, phone });
    expect(driver.statusCode, driver.body).toBe(201);
    const rental = await req(cookie).post('/api/v1/rentals', {
      vehicleId: vehicle.json().id,
      driverId: driver.json().id,
      startDate: '2026-11-01',
      rentalType: 'WEEKLY',
      periodicAmountCents: 60000,
      depositCents: 0,
    });
    expect(rental.statusCode, rental.body).toBe(201);
    return { driverId: driver.json().id as string, rentalId: rental.json().id as string, vehicleId: vehicle.json().id as string };
  }

  const notificationsFor = (title: RegExp) =>
    harness.ctx.mongo.collections.notifications.find({ organizationId, title: { $regex: title } }).toArray();

  beforeAll(async () => {
    await fake.start();
    harness = await createHarness(fake.env());
    fake.app = harness.app;
    const now = new Date();
    organizationId = new ObjectId();
    await harness.ctx.mongo.collections.organizations.insertOne({
      _id: organizationId,
      name: 'FF Veículos',
      legalId: null,
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      settings: { freeSeats: 3, extraSeatPriceCents: 990 },
      createdAt: now,
      updatedAt: now,
    } as never);
    const userId = new ObjectId();
    await harness.ctx.mongo.collections.users.insertOne({
      _id: userId, name: 'Dono', emailLower: 'dono@ff.test', passwordHash: await hashPassword('Senha@123456'), phone: null,
      status: 'ACTIVE', browserNotificationsEnabled: false, lastLoginAt: null, createdAt: now, updatedAt: now,
    } as never);
    await harness.ctx.mongo.collections.memberships.insertOne({
      _id: new ObjectId(), organizationId, userId, role: 'OWNER', permissions: fullMatrix(), status: 'ACTIVE', createdAt: now, updatedAt: now,
    } as never);
    const login = await harness.app.inject({ method: 'POST', url: '/api/v1/auth/login', payload: { email: 'dono@ff.test', password: 'Senha@123456' } });
    cookie = sessionCookie(login.headers as Record<string, unknown>);
    // A locadora dona do canal é a única com a coleta pelo WhatsApp ligada.
    const settings = await harness.app.inject({
      method: 'PUT', url: '/api/v1/inspection/whatsapp-settings', headers: { cookie },
      payload: { enabled: true, sendTime: '09:00', reminderAfterHours: 24, maxReminders: 1, collectionTtlHours: 72, instructions: {} },
    });
    expect(settings.statusCode).toBe(200);
  });

  afterAll(async () => {
    await harness?.close();
    await fake.stop();
  });

  beforeEach(() => fake.reset());

  it('telefone do WhatsApp com ou sem o nono dígito encontra o cadastro', () => {
    expect(phoneCandidates('+5511988465766')).toEqual(['11988465766', '1188465766']);
    expect(phoneCandidates('+551188465766')).toEqual(['1188465766', '11988465766']);
    expect(phoneCandidates('+1555')).toEqual([]);
  });

  it('chamado de manutenção vira pedido do motorista, com a foto, e o reprocessamento não duplica', async () => {
    const d = await rentedDriver('11977001001');
    const media = fake.addMedia(tinyPng(41));
    const event = fake.record('maintenance.requested', {
      contactPhoneE164: '+5511977001001',
      part: 'freios',
      partLabel: '🛑 Freios / Pastilhas',
      description: 'Barulho metálico ao frear',
      media: [{ ...media, mimeType: 'image/png', size: tinyPng(41).length, wamid: 'wamid.MANUT1' }],
    });
    expect((await fake.deliver(event)).statusCode).toBe(204);
    expect((await fake.deliver(event)).statusCode).toBe(204); // mesmo evento de novo

    const docs = await harness.ctx.mongo.collections.maintenanceRequests.find({ driverId: new ObjectId(d.driverId) }).toArray();
    expect(docs).toHaveLength(1);
    expect(docs[0]).toMatchObject({
      category: 'MECHANICAL',
      status: 'OPEN',
      vehicleStopped: false,
      rentalId: new ObjectId(d.rentalId),
      sourceEventId: event.eventId,
    });
    expect(docs[0]!.description).toBe('🛑 Freios / Pastilhas: Barulho metálico ao frear');
    expect(docs[0]!.photoFileIds).toHaveLength(1);
    const file = await harness.ctx.mongo.collections.files.findOne({ _id: docs[0]!.photoFileIds[0] });
    expect(file).toMatchObject({ purpose: 'MAINTENANCE_REQUEST_PHOTO', organizationId });
    expect(await notificationsFor(/pedido de manutenção/)).toHaveLength(1);
  });

  it('foto que expirou no Whaply (404): o pedido é aberto mesmo assim e avisa a perda', async () => {
    const d = await rentedDriver('11977001002');
    const expired = { mediaRef: 'ref-que-nao-existe-mais-00', sha256: 'a'.repeat(64) };
    await fake.emit('maintenance.requested', {
      contactPhoneE164: '+5511977001002', part: 'pneus', partLabel: '🛞 Pneus / Suspensão', description: 'Pneu furado',
      media: [{ ...expired, mimeType: 'image/png', size: 100, wamid: 'wamid.MANUT2' }],
    });
    const doc = await harness.ctx.mongo.collections.maintenanceRequests.findOne({ driverId: new ObjectId(d.driverId) });
    expect(doc).toMatchObject({ category: 'TIRES', photoFileIds: [] });
    expect(doc!.description).toContain('1 foto(s) não puderam ser recebidas');
  });

  it('Whaply indisponível no momento (503): não abre pedido sem a foto; abre quando o reenvio funciona', async () => {
    const d = await rentedDriver('11977001005');
    const later = fake.addMedia(tinyPng(44), 'image/png', false);
    const event = fake.record('maintenance.requested', {
      contactPhoneE164: '+5511977001005', part: 'eletrica', partLabel: '⚡ Elétrica / Bateria', description: 'Não liga',
      media: [{ ...later, mimeType: 'image/png', size: tinyPng(44).length, wamid: 'wamid.MANUT5' }],
    });
    expect((await fake.deliver(event)).statusCode).toBeGreaterThanOrEqual(500); // o Whaply reenviará
    expect(await harness.ctx.mongo.collections.maintenanceRequests.countDocuments({ driverId: new ObjectId(d.driverId) })).toBe(0);

    fake.media.get(later.mediaRef)!.available = true;
    expect((await fake.deliver(event)).statusCode).toBe(204);
    const doc = await harness.ctx.mongo.collections.maintenanceRequests.findOne({ driverId: new ObjectId(d.driverId) });
    expect(doc).toMatchObject({ category: 'ELECTRICAL' });
    expect(doc!.photoFileIds).toHaveLength(1);
  });

  it('número sem motorista: não abre pedido em nome de ninguém e alerta o dono', async () => {
    const before = await harness.ctx.mongo.collections.maintenanceRequests.countDocuments({});
    await fake.emit('maintenance.requested', {
      contactPhoneE164: '+5511900000000', part: 'outro', partLabel: '🔍 Outro problema', description: 'Barulho', media: [],
    });
    expect(await harness.ctx.mongo.collections.maintenanceRequests.countDocuments({})).toBe(before);
    expect(await notificationsFor(/manutenção de número desconhecido/)).toHaveLength(1);
  });

  it('comprovante em PDF fica pendente na aba Pagamentos; o dono confere; evento repetido não duplica', async () => {
    const d = await rentedDriver('11977001003');
    const media = fake.addMedia(PDF, 'application/pdf');
    const event = fake.record('payment.receipt_received', {
      contactPhoneE164: '+5511977001003', ...media, mimeType: 'application/pdf', size: PDF.length, wamid: 'wamid.PIX1', caption: 'semana 46',
    });
    expect((await fake.deliver(event)).statusCode).toBe(204);
    expect((await fake.deliver(event)).statusCode).toBe(204);

    const list = await req(cookie).get(`/api/v1/rentals/${d.rentalId}/payment-receipts`);
    expect(list.statusCode, list.body).toBe(200);
    const receipts = list.json().data;
    expect(receipts).toHaveLength(1);
    expect(receipts[0]).toMatchObject({ status: 'PENDING_REVIEW', caption: 'semana 46', senderPhone: '+5511977001003', source: 'WHATSAPP' });
    expect(receipts[0].file.contentType).toBe('application/pdf');
    expect(await notificationsFor(/Comprovante recebido pelo WhatsApp/)).toHaveLength(1);

    const reviewed = await req(cookie).post(`/api/v1/rentals/${d.rentalId}/payment-receipts/${receipts[0].id}/review`, {});
    expect(reviewed.statusCode, reviewed.body).toBe(200);
    expect(reviewed.json().data[0]).toMatchObject({ status: 'REVIEWED' });
    // Conferir de novo é idempotente.
    expect((await req(cookie).post(`/api/v1/rentals/${d.rentalId}/payment-receipts/${receipts[0].id}/review`, {})).statusCode).toBe(200);
  });

  it('comprovante de número desconhecido é guardado sem motorista e gera alerta', async () => {
    const media = fake.addMedia(tinyPng(43));
    await fake.emit('payment.receipt_received', {
      contactPhoneE164: '+5511900000001', ...media, mimeType: 'image/png', size: tinyPng(43).length, wamid: 'wamid.PIX2',
    });
    const doc = await harness.ctx.mongo.collections.paymentReceipts.findOne({ wamid: 'wamid.PIX2' });
    expect(doc).toMatchObject({ driverId: null, rentalId: null, status: 'PENDING_REVIEW' });
    expect(await notificationsFor(/comprovante de número desconhecido/)).toHaveLength(1);
  });

  it('com duas locadoras ligadas e sem WHAPLY_ORGANIZATION_ID, o evento não cai em nenhuma', async () => {
    const now = new Date();
    await harness.ctx.mongo.collections.organizations.insertOne({
      _id: new ObjectId(), name: 'Outra Locadora', legalId: null, timezone: 'America/Sao_Paulo', currency: 'BRL',
      settings: { freeSeats: 3, extraSeatPriceCents: 990, inspectionWhatsapp: { enabled: true } }, createdAt: now, updatedAt: now,
    } as never);
    await rentedDriver('11977001004');
    const before = await harness.ctx.mongo.collections.maintenanceRequests.countDocuments({});
    expect((await fake.emit('maintenance.requested', {
      contactPhoneE164: '+5511977001004', part: 'motor', partLabel: '⚙️ Motor', description: 'Luz da injeção', media: [],
    })).statusCode).toBe(204);
    expect(await harness.ctx.mongo.collections.maintenanceRequests.countDocuments({})).toBe(before);
  });
});
