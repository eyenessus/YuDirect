import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ObjectId } from 'mongodb';
import { fullMatrix } from '@yudirect/contracts';
import { createHarness, sessionCookie, type TestHarness } from '../testing/harness.js';
import { FakeWhaply } from '../testing/fake-whaply.js';
import { hashPassword } from '../common/helpers.js';
import { dispatchDueInspections, sendPendingMessages } from '../services/whatsapp-inspection.js';

/* ------------------------------------------------------------------ *
 * Canal das fotos por locadora (vistoria pelo formulário do WhatsApp):
 * FLOW pede ao Whaply o template com botão de formulário, sem botão de link;
 * o canal fica fixado na vistoria quando ela é planejada.
 * ------------------------------------------------------------------ */

describe('canal das fotos: formulário (FLOW) por locadora', () => {
  const fake = new FakeWhaply();
  let harness: TestHarness;
  let cookie: string;
  let counter = 0;
  const later = () => new Date(Date.now() + 40 * 24 * 3600 * 1000);

  const req = (c: string) => ({
    get: (url: string) => harness.app.inject({ method: 'GET', url, headers: { cookie: c } }),
    post: (url: string, payload?: unknown) => harness.app.inject({ method: 'POST', url, headers: { cookie: c }, payload: payload as never }),
    put: (url: string, payload?: unknown) => harness.app.inject({ method: 'PUT', url, headers: { cookie: c }, payload: payload as never }),
  });

  async function settings(photoChannel: 'CHAT' | 'FLOW') {
    const res = await req(cookie).put('/api/v1/inspection/whatsapp-settings', {
      enabled: true, sendTime: '09:00', reminderAfterHours: 24, maxReminders: 1, collectionTtlHours: 72, instructions: {}, photoChannel,
    });
    expect(res.statusCode, res.body).toBe(200);
  }

  async function plannedInspection() {
    counter += 1;
    const phone = `1196600${String(1000 + counter).slice(-4)}`;
    const vehicle = await req(cookie).post('/api/v1/vehicles', { plate: `FLW${counter}A${String(counter).padStart(2, '0')}`, brand: 'Fiat', model: 'Mobi' });
    const driver = await req(cookie).post('/api/v1/drivers', { fullName: `Motorista Flow ${counter}`, phone });
    await req(cookie).put(`/api/v1/drivers/${driver.json().id}/whatsapp-consent`, { action: 'GRANT', source: 'CONTRACT' });
    const rental = await req(cookie).post('/api/v1/rentals', {
      vehicleId: vehicle.json().id, driverId: driver.json().id, startDate: '2026-11-01', rentalType: 'WEEKLY', periodicAmountCents: 60000, depositCents: 0,
    });
    expect(rental.statusCode, rental.body).toBe(201);
    const res = await req(cookie).post(`/api/v1/vehicles/${vehicle.json().id}/inspections/request`, {
      responsibleName: `Motorista Flow ${counter}`, phone, scheduledAt: '2026-11-20',
    });
    expect(res.statusCode, res.body).toBe(201);
    return res.json().inspection.id as string;
  }

  async function sentBody(inspectionId: string) {
    await dispatchDueInspections(harness.ctx, later());
    await sendPendingMessages(harness.ctx, later());
    const rec = [...fake.requests.values()].find((r) => r.body.externalRef.id === inspectionId);
    expect(rec).toBeTruthy();
    return rec!.body;
  }

  beforeAll(async () => {
    await fake.start();
    harness = await createHarness(fake.env());
    fake.app = harness.app;
    const now = new Date();
    const organizationId = new ObjectId();
    await harness.ctx.mongo.collections.organizations.insertOne({
      _id: organizationId, name: 'FF Veículos', legalId: null, timezone: 'America/Sao_Paulo', currency: 'BRL',
      settings: { freeSeats: 3, extraSeatPriceCents: 990 }, createdAt: now, updatedAt: now,
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
  });

  afterAll(async () => {
    await harness?.close();
    await fake.stop();
  });

  beforeEach(() => fake.reset());

  it('padrão é CHAT; ao escolher FLOW a tela mostra os templates do formulário', async () => {
    await settings('CHAT');
    let res = await req(cookie).get('/api/v1/inspection/whatsapp-settings');
    expect(res.json().settings.photoChannel).toBe('CHAT');
    expect(res.json().templates.request).toBe('yudirect_vistoria_solicitacao');

    await settings('FLOW');
    res = await req(cookie).get('/api/v1/inspection/whatsapp-settings');
    expect(res.json().settings.photoChannel).toBe('FLOW');
    expect(res.json().templates).toMatchObject({ request: 'yudirect_vistoria_solicitacao_flow', reminder: 'yudirect_vistoria_lembrete_flow' });
  });

  it('FLOW: pede o template do formulário, sem botão de link, com collectionMode FLOW', async () => {
    await settings('FLOW');
    const id = await plannedInspection();
    const doc = await harness.ctx.mongo.collections.inspections.findOne({ _id: new ObjectId(id) });
    expect(doc?.collection?.photoChannel).toBe('FLOW');

    const body = await sentBody(id);
    expect(body.collectionMode).toBe('FLOW');
    expect(body.template.name).toBe('yudirect_vistoria_solicitacao_flow');
    expect(body.template.urlButtonParam).toBeNull();
    expect(body.session?.steps.map((s) => s.type)).toContain('NUMBER'); // KM continua sendo pedida
  });

  it('o canal fica preso à vistoria: mudar a configuração não altera uma vistoria já planejada', async () => {
    await settings('FLOW');
    const planned = await plannedInspection();
    await settings('CHAT');
    const fresh = await plannedInspection();

    const flowBody = await sentBody(planned);
    expect(flowBody.collectionMode).toBe('FLOW');
    const chatBody = await sentBody(fresh);
    expect(chatBody.collectionMode).toBeUndefined();
    expect(chatBody.template.name).toBe('yudirect_vistoria_solicitacao');
    expect(chatBody.template.urlButtonParam).toBeTruthy();
  });
});
