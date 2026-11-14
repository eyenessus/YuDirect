import type { FastifyInstance } from 'fastify';
import {
  rentalPaymentCreateSchema,
  rentalPaymentListQuerySchema,
  rentalPaymentPaySchema,
  rentalPaymentUpdateSchema,
} from '@yudirect/contracts';
import { toObjectId } from '../../common/helpers.js';
import { requireAuthContext } from '../../plugins/auth.js';
import {
  buildView,
  createEntry,
  deleteEntry,
  loadRental,
  markEntryPaid,
  updateEntry,
} from '../../services/rental-payments.js';
import { listRentalReceipts, markReceiptReviewed } from '../../services/whatsapp-locadora.js';

/**
 * Aba "Pagamentos" da página da locação.
 * Cada mutação devolve a visão completa (cartões + lista) já atualizada.
 */
export async function registerRentalPaymentRoutes(app: FastifyInstance): Promise<void> {
  /* Comprovantes enviados pelo motorista no WhatsApp (pendentes de conferência). */
  app.get(
    '/rentals/:id/payment-receipts',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'read')] },
    async (request) => {
      const ctx = request.appCtx;
      const { organizationId } = requireAuthContext(request);
      const rental = await loadRental(ctx, organizationId, toObjectId((request.params as { id: string }).id));
      return { data: await listRentalReceipts(ctx, organizationId, rental._id) };
    },
  );

  app.post(
    '/rentals/:id/payment-receipts/:receiptId/review',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'pay')] },
    async (request) => {
      const ctx = request.appCtx;
      const auth = requireAuthContext(request);
      const params = request.params as { id: string; receiptId: string };
      const rental = await loadRental(ctx, auth.organizationId, toObjectId(params.id));
      await markReceiptReviewed(ctx, {
        organizationId: auth.organizationId,
        rentalId: rental._id,
        receiptId: toObjectId(params.receiptId),
        actorId: auth.userId,
      });
      return { data: await listRentalReceipts(ctx, auth.organizationId, rental._id) };
    },
  );

  app.get(
    '/rentals/:id/payments',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'read')] },
    async (request) => {
      const ctx = request.appCtx;
      const { organizationId } = requireAuthContext(request);
      const query = rentalPaymentListQuerySchema.parse(request.query);
      const rental = await loadRental(ctx, organizationId, toObjectId((request.params as { id: string }).id));
      return buildView(ctx, rental, query.q);
    },
  );

  app.post(
    '/rentals/:id/payments',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'pay')] },
    async (request, reply) => {
      const ctx = request.appCtx;
      const auth = requireAuthContext(request);
      const body = rentalPaymentCreateSchema.parse(request.body);
      const idempotencyKey = (request.headers['idempotency-key'] as string | undefined) ?? null;
      const result = await createEntry(ctx, {
        organizationId: auth.organizationId,
        actorId: auth.userId,
        rentalId: toObjectId((request.params as { id: string }).id),
        category: body.category,
        amountCents: body.amountCents,
        expectedDate: body.expectedDate,
        alreadyPaid: body.alreadyPaid,
        paidAt: body.paidAt,
        method: body.method,
        notes: body.notes ?? null,
        idempotencyKey,
      });
      reply.status(result.alreadyProcessed ? 200 : 201);
      return result.view;
    },
  );

  app.patch(
    '/rentals/:id/payments/:entryId',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'pay')] },
    async (request) => {
      const ctx = request.appCtx;
      const auth = requireAuthContext(request);
      const params = request.params as { id: string; entryId: string };
      const body = rentalPaymentUpdateSchema.parse(request.body);
      return updateEntry(ctx, {
        organizationId: auth.organizationId,
        actorId: auth.userId,
        rentalId: toObjectId(params.id),
        entryId: toObjectId(params.entryId, 'entryId'),
        amountCents: body.amountCents,
        expectedDate: body.expectedDate,
        notes: body.notes,
      });
    },
  );

  /** "Marcar como pago" num lançamento pendente. */
  app.post(
    '/rentals/:id/payments/:entryId/pay',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'pay')] },
    async (request) => {
      const ctx = request.appCtx;
      const auth = requireAuthContext(request);
      const params = request.params as { id: string; entryId: string };
      const body = rentalPaymentPaySchema.parse(request.body);
      return markEntryPaid(ctx, {
        organizationId: auth.organizationId,
        actorId: auth.userId,
        rentalId: toObjectId(params.id),
        entryId: toObjectId(params.entryId, 'entryId'),
        paidAt: body.paidAt,
        method: body.method,
      });
    },
  );

  /** Excluir: pendente é removido; pago é ESTORNADO (histórico preservado). */
  app.delete(
    '/rentals/:id/payments/:entryId',
    { onRequest: [app.requireAuth, app.requirePermission('finance', 'delete')] },
    async (request) => {
      const ctx = request.appCtx;
      const auth = requireAuthContext(request);
      const params = request.params as { id: string; entryId: string };
      return deleteEntry(ctx, {
        organizationId: auth.organizationId,
        actorId: auth.userId,
        rentalId: toObjectId(params.id),
        entryId: toObjectId(params.entryId, 'entryId'),
      });
    },
  );
}
