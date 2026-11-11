/**
 * Project Vial diagnostics verification. Synthetic data only; mock provider; no network.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { createDiagnosticsService, createMemoryStore, createMockProvider, ORDER_STATUS as S, DiagnosticsError } from '../src/diagnostics/index.js';
import { handleDiagnosticsWebhook, createDiagnosticsWebhookHandler } from '../server/diagnosticsWebhook.js';

let passed = 0;
const t = async (name, fn) => { await fn(); passed++; console.log(`  ok  ${name}`); };
const rejects = async (p, code) => {
  try { await p; } catch (e) { assert.ok(e instanceof DiagnosticsError, `expected DiagnosticsError, got ${e}`); assert.strictEqual(e.code, code); return; }
  assert.fail(`expected rejection ${code}`);
};

const WS = 'ws_demo';
const doctor = { role: 'doctor', uid: 'doc1', workspaceId: WS };
const patient = { role: 'patient', uid: 'p1', workspaceId: WS, participantId: 'part1' };
const otherPatient = { role: 'patient', uid: 'p2', workspaceId: WS, participantId: 'part2' };
const otherDoctor = { role: 'doctor', uid: 'doc2', workspaceId: 'ws_other' };
const consent = { given: true };
const slot = { slotId: '2026-12-01T09:00', date: '2026-12-01' };

function fresh() {
  let n = 0;
  const svc = createDiagnosticsService({ idGen: () => `o${++n}`, clock: () => '2026-11-11T00:00:00.000Z' });
  return svc;
}
const mkOrder = (svc, extra = {}) => svc.createOrder({ actor: doctor, doctorId: 'doc1', participantId: 'part1', workspaceId: WS, tests: ['cbc', 'hba1c'], dueDate: '2026-12-05', doctorNote: 'fasting not needed', ...extra });
const mkBooked = async svc => { const o = await mkOrder(svc); return svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '560001', consent }); };

console.log('Project Vial diagnostics suite');

await t('happy path end to end (ordered, booked, collected, reported, released)', async () => {
  const svc = fresh();
  const o = await mkOrder(svc);
  assert.strictEqual(o.status, S.ORDERED);
  const b = await svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '560001', consent });
  assert.strictEqual(b.status, S.BOOKED);
  assert.ok(b.booking.providerBookingId);
  assert.strictEqual(b.consent.given, true);
  for (const ev of svc._provider.happyPathEvents(b.booking.providerBookingId)) {
    const r = await svc.applyProviderEvent(ev);
    assert.strictEqual(r.applied, true);
  }
  const dv = await svc.getDoctorView({ actor: doctor, orderId: o.id });
  assert.strictEqual(dv.order.status, S.REPORTED);
  assert.strictEqual(dv.pendingReview, true);
  assert.ok(dv.results.length === 2);
  const rel = await svc.releaseReport({ actor: doctor, orderId: o.id, releaseNote: 'Please discuss at next visit' });
  assert.strictEqual(rel.status, S.RELEASED);
  const pv = await svc.getPatientView({ actor: patient, orderId: o.id });
  assert.strictEqual(pv.reportAvailable, true);
  const p0 = pv.results[0].parameters[0];
  assert.deepStrictEqual(Object.keys(p0).sort(), ['code', 'name', 'reference', 'unit', 'value']);
  assert.ok(typeof p0.value === 'number' && p0.unit && p0.reference.text);
  assert.deepStrictEqual(rel.history.map(h => h.to), ['ordered', 'booked', 'collected', 'reported', 'released']);
});

await t('only a doctor of the workspace can create an order', async () => {
  const svc = fresh();
  const base = { doctorId: 'doc1', participantId: 'part1', workspaceId: WS, tests: ['cbc'] };
  await rejects(svc.createOrder({ ...base, actor: patient }), 'DOCTOR_ONLY');
  await rejects(svc.createOrder({ ...base, actor: undefined }), 'DOCTOR_ONLY');
  await rejects(svc.createOrder({ ...base, actor: otherDoctor }), 'WORKSPACE_MISMATCH');
  await rejects(svc.createOrder({ ...base, actor: doctor, doctorId: 'someone_else' }), 'DOCTOR_MISMATCH');
  await rejects(svc.createOrder({ ...base, actor: doctor, tests: [] }), 'TESTS_REQUIRED');
  await rejects(svc.createOrder({ ...base, actor: doctor, tests: ['not_a_test'] }), 'UNKNOWN_TEST');
  assert.strictEqual(svc._store._count(), 0);
});

await t('no automatic or recurring orders: forbidden fields rejected, events cannot create orders, no suggest API', async () => {
  const svc = fresh();
  for (const f of ['recurrence', 'retestAfter', 'autoRetest', 'schedule']) {
    await rejects(svc.createOrder({ actor: doctor, doctorId: 'doc1', participantId: 'part1', workspaceId: WS, tests: ['cbc'], [f]: '3 months' }), 'FORBIDDEN_FIELD');
  }
  await rejects(svc.applyProviderEvent({ eventId: 'x1', type: 'sample_collected', providerBookingId: 'GHOST' }), 'UNKNOWN_BOOKING');
  assert.strictEqual(svc._store._count(), 0);
  // completing the full lifecycle creates no further order
  const b = await mkBooked(svc);
  for (const ev of svc._provider.happyPathEvents(b.booking.providerBookingId)) await svc.applyProviderEvent(ev);
  await svc.releaseReport({ actor: doctor, orderId: b.id });
  assert.strictEqual(svc._store._count(), 1);
  // static guard: no suggest/auto/schedule/retest exports in the module surface or source
  const mod = await import('../src/diagnostics/index.js');
  for (const name of Object.keys(mod)) assert.ok(!/suggest|autoOrder|autoRetest|scheduleRetest|recommend/i.test(name), `forbidden export ${name}`);
  const src = ['diagnosticsService.js', 'mockProvider.js', 'store.js', 'catalog.js'].map(f => fs.readFileSync(`./src/diagnostics/${f}`, 'utf8')).join('\n');
  assert.ok(!/\b(abnormal|critical|high risk|too high|too low)\b/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'no interpretation text in code');
  assert.ok(!/setTimeout|setInterval|cron/i.test(src), 'no timers or cron in diagnostics module');
});

await t('consent is required to book', async () => {
  const svc = fresh();
  const o = await mkOrder(svc);
  for (const c of [undefined, null, {}, { given: false }, { given: 'yes' }]) {
    await rejects(svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '560001', consent: c }), 'CONSENT_REQUIRED');
  }
  assert.strictEqual((await svc.getDoctorView({ actor: doctor, orderId: o.id })).order.status, S.ORDERED);
});

await t('booking guards: wrong patient, unserviceable pincode, bad slot, provider failure', async () => {
  const svc = fresh();
  const o = await mkOrder(svc);
  await rejects(svc.bookOrder({ actor: otherPatient, orderId: o.id, slot, pincode: '560001', consent }), 'NOT_ORDER_PATIENT');
  await rejects(svc.bookOrder({ actor: doctor, orderId: o.id, slot, pincode: '560001', consent }), 'NOT_ORDER_PATIENT');
  await rejects(svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '999999', consent }), 'NOT_SERVICEABLE');
  await rejects(svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '56001', consent }), 'NOT_SERVICEABLE');
  await rejects(svc.bookOrder({ actor: patient, orderId: o.id, slot: { slotId: 'nope', date: '2026-12-01' }, pincode: '560001', consent }), 'SLOT_UNAVAILABLE');
  const bad = createDiagnosticsService({ provider: createMockProvider({ failCreateBooking: true }), idGen: () => 'ox' });
  const o2 = await bad.createOrder({ actor: doctor, doctorId: 'doc1', participantId: 'part1', workspaceId: WS, tests: ['tsh'] });
  await rejects(bad.bookOrder({ actor: patient, orderId: o2.id, slot, pincode: '560001', consent }), 'PROVIDER_ERROR');
  assert.strictEqual((await bad.getDoctorView({ actor: doctor, orderId: 'ox' })).order.status, S.ORDERED);
  const done = await mkBooked(svc);
  await rejects(svc.bookOrder({ actor: patient, orderId: done.id, slot, pincode: '560001', consent }), 'INVALID_TRANSITION');
});

await t('duplicate provider event is idempotent', async () => {
  const svc = fresh();
  const b = await mkBooked(svc);
  const ev = svc._provider.buildEvent('sample_collected', b.booking.providerBookingId);
  const first = await svc.applyProviderEvent(ev);
  const second = await svc.applyProviderEvent(ev);
  assert.strictEqual(first.applied, true);
  assert.strictEqual(second.applied, false);
  assert.strictEqual(second.duplicate, true);
  const rep = svc._provider.buildEvent('report_ready', b.booking.providerBookingId);
  await svc.applyProviderEvent(rep);
  const again = await svc.applyProviderEvent(ev); // replay of old event after progress
  assert.strictEqual(again.duplicate, true);
  const o = (await svc.getDoctorView({ actor: doctor, orderId: b.id })).order;
  assert.strictEqual(o.status, S.REPORTED);
  assert.strictEqual(o.history.filter(h => h.to === S.COLLECTED).length, 1);
});

await t('out-of-order and unknown events are rejected', async () => {
  const svc = fresh();
  const b = await mkBooked(svc);
  const pb = b.booking.providerBookingId;
  const report = svc._provider.buildEvent('report_ready', pb); // booked -> reported skips collected
  await rejects(svc.applyProviderEvent(report), 'OUT_OF_ORDER');
  await rejects(svc.applyProviderEvent({ eventId: 'e9', type: 'teleported', providerBookingId: pb }), 'UNKNOWN_EVENT_TYPE');
  await rejects(svc.applyProviderEvent({ type: 'sample_collected' }), 'BAD_EVENT');
  assert.strictEqual((await svc.getDoctorView({ actor: doctor, orderId: b.id })).order.status, S.BOOKED);
  await svc.applyProviderEvent(svc._provider.buildEvent('sample_collected', pb));
  await rejects(svc.applyProviderEvent({ eventId: 'late', type: 'collection_failed', providerBookingId: pb }), 'OUT_OF_ORDER');
  // report for a test that was not ordered is rejected
  await rejects(svc.applyProviderEvent({ eventId: 'bad', type: 'report_ready', providerBookingId: pb, report: { results: [{ testCode: 'tsh', parameters: [{ code: 'tsh', name: 'x', value: 1, unit: 'u' }] }] } }), 'BAD_REPORT');
});

await t('patient sees no result values before release; stripped of flags always', async () => {
  const svc = fresh();
  const b = await mkBooked(svc);
  const pb = b.booking.providerBookingId;
  await svc.applyProviderEvent({ eventId: 'c', type: 'sample_collected', providerBookingId: pb });
  let pv = await svc.getPatientView({ actor: patient, orderId: b.id });
  assert.strictEqual(pv.results, null);
  const ev = svc._provider.buildEvent('report_ready', pb);
  ev.report.results[0].parameters[0].flag = 'HIGH';
  ev.report.results[0].parameters[0].interpretation = 'Abnormal, see a doctor';
  await svc.applyProviderEvent(ev);
  pv = await svc.getPatientView({ actor: patient, orderId: b.id });
  assert.strictEqual(pv.status, S.REPORTED);
  assert.strictEqual(pv.results, null);
  assert.strictEqual(pv.reportAvailable, false);
  const raw = JSON.stringify(pv);
  assert.ok(!raw.includes('"value"'), 'no values in unreleased patient view');
  assert.ok(!/HIGH|Abnormal/.test(raw));
  await rejects(svc.getPatientView({ actor: otherPatient, orderId: b.id }), 'NOT_ORDER_PATIENT');
  await rejects(svc.getDoctorView({ actor: patient, orderId: b.id }), 'DOCTOR_ONLY');
  await rejects(svc.getDoctorView({ actor: otherDoctor, orderId: b.id }), 'WORKSPACE_MISMATCH');
  await rejects(svc.releaseReport({ actor: patient, orderId: b.id }), 'DOCTOR_ONLY');
  await rejects(svc.releaseReport({ actor: otherDoctor, orderId: b.id }), 'WORKSPACE_MISMATCH');
  await svc.releaseReport({ actor: doctor, orderId: b.id });
  pv = await svc.getPatientView({ actor: patient, orderId: b.id });
  assert.ok(pv.results.length === 2);
  assert.ok(!/HIGH|Abnormal|interpretation|flag/.test(JSON.stringify(pv)), 'flag and interpretation stripped');
  await rejects(svc.releaseReport({ actor: doctor, orderId: b.id }), 'INVALID_TRANSITION');
});

await t('cancel paths', async () => {
  const svc = fresh();
  // patient cancels before booking
  const o1 = await mkOrder(svc);
  assert.strictEqual((await svc.cancelOrder({ actor: patient, orderId: o1.id, reason: 'changed mind' })).status, S.CANCELLED);
  // doctor cancels a booked order; provider booking is cancelled too
  const b = await mkBooked(svc);
  const c = await svc.cancelOrder({ actor: doctor, orderId: b.id, reason: 'plan changed' });
  assert.strictEqual(c.status, S.CANCELLED);
  assert.strictEqual(svc._provider._bookings.get(b.booking.providerBookingId).state, 'cancelled');
  // terminal: cannot cancel twice or rebook
  await rejects(svc.cancelOrder({ actor: doctor, orderId: b.id }), 'INVALID_TRANSITION');
  await rejects(svc.bookOrder({ actor: patient, orderId: b.id, slot, pincode: '560001', consent }), 'INVALID_TRANSITION');
  // strangers cannot cancel
  const o3 = await mkOrder(svc);
  await rejects(svc.cancelOrder({ actor: otherPatient, orderId: o3.id }), 'NOT_AUTHORIZED');
  await rejects(svc.cancelOrder({ actor: otherDoctor, orderId: o3.id }), 'NOT_AUTHORIZED');
  // cannot cancel after sample collected
  const b2 = await mkBooked(svc);
  await svc.applyProviderEvent(svc._provider.buildEvent('sample_collected', b2.booking.providerBookingId));
  await rejects(svc.cancelOrder({ actor: patient, orderId: b2.id }), 'INVALID_TRANSITION');
  // provider-initiated cancel and failure
  const b3 = await mkBooked(svc);
  const pc = await svc.applyProviderEvent(svc._provider.buildEvent('booking_cancelled', b3.booking.providerBookingId));
  assert.strictEqual(pc.order.status, S.CANCELLED);
  assert.strictEqual(pc.order.cancelledBy, 'provider');
  const b4 = await mkBooked(svc);
  const pf = await svc.applyProviderEvent({ eventId: 'f1', type: 'collection_failed', providerBookingId: b4.booking.providerBookingId, reason: 'patient not home' });
  assert.strictEqual(pf.order.status, S.FAILED);
  assert.strictEqual((await svc.listDoctorOrders({ actor: doctor, status: S.FAILED })).length, 1);
});

await t('workspace isolation in listings', async () => {
  const svc = fresh();
  await mkOrder(svc);
  assert.strictEqual((await svc.listDoctorOrders({ actor: doctor })).length, 1);
  assert.strictEqual((await svc.listDoctorOrders({ actor: otherDoctor })).length, 0);
  assert.strictEqual((await svc.listPatientOrders({ actor: patient })).length, 1);
  assert.strictEqual((await svc.listPatientOrders({ actor: otherPatient })).length, 0);
});

await t('mock provider is deterministic and covers all five tests', async () => {
  const a = createMockProvider(), b = createMockProvider();
  const slotsA = a.getSlots('560001', '2026-12-01');
  assert.deepStrictEqual(slotsA, b.getSlots('560001', '2026-12-01'));
  assert.strictEqual(a.getSlots('999999', '2026-12-01').length, 0);
  assert.strictEqual(a.checkServiceability('400001').city, 'Mumbai');
  const svc = createDiagnosticsService({ idGen: () => 'oall' });
  const o = await svc.createOrder({ actor: doctor, doctorId: 'doc1', participantId: 'part1', workspaceId: WS, tests: ['cbc', 'hba1c', 'lipid', 'tsh', 'vitd'] });
  const bk = await svc.bookOrder({ actor: patient, orderId: o.id, slot, pincode: '110001', consent });
  for (const ev of svc._provider.happyPathEvents(bk.booking.providerBookingId)) await svc.applyProviderEvent(ev);
  const r = (await svc.getDoctorView({ actor: doctor, orderId: o.id })).results;
  assert.deepStrictEqual(r.map(x => x.testCode), ['cbc', 'hba1c', 'lipid', 'tsh', 'vitd']);
  for (const res of r) for (const p of res.parameters) assert.ok(typeof p.value === 'number' && p.unit && p.reference.text);
});

// ---- webhook ----
const SECRET = 'test-only-secret';
const sign = (body, secret = SECRET) => 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

await t('webhook: valid signature applies event; duplicate acknowledged', async () => {
  const svc = fresh();
  const b = await mkBooked(svc);
  const raw = JSON.stringify(svc._provider.buildEvent('sample_collected', b.booking.providerBookingId));
  const r1 = await handleDiagnosticsWebhook({ rawBody: raw, signatureHeader: sign(raw) }, { service: svc, secret: SECRET });
  assert.strictEqual(r1.status, 200); assert.strictEqual(r1.body.applied, true);
  const r2 = await handleDiagnosticsWebhook({ rawBody: raw, signatureHeader: sign(raw) }, { service: svc, secret: SECRET });
  assert.strictEqual(r2.status, 200); assert.strictEqual(r2.body.duplicate, true);
  const bad = JSON.stringify({ eventId: 'z', type: 'report_ready', providerBookingId: 'NOPE' });
  assert.strictEqual((await handleDiagnosticsWebhook({ rawBody: bad, signatureHeader: sign(bad) }, { service: svc, secret: SECRET })).status, 404);
  const ooo = JSON.stringify(svc._provider.buildEvent('collection_failed', b.booking.providerBookingId));
  assert.strictEqual((await handleDiagnosticsWebhook({ rawBody: ooo, signatureHeader: sign(ooo) }, { service: svc, secret: SECRET })).status, 409);
  assert.strictEqual((await handleDiagnosticsWebhook({ rawBody: '{nope', signatureHeader: sign('{nope') }, { service: svc, secret: SECRET })).status, 400);
});

await t('webhook: bad or missing signature rejected, state untouched', async () => {
  const svc = fresh();
  const b = await mkBooked(svc);
  const raw = JSON.stringify(svc._provider.buildEvent('sample_collected', b.booking.providerBookingId));
  for (const hdr of [sign(raw, 'wrong-secret'), undefined, 'sha256=zz', 'md5=abc', 'sha256=' + 'a'.repeat(64)]) {
    const r = await handleDiagnosticsWebhook({ rawBody: raw, signatureHeader: hdr }, { service: svc, secret: SECRET });
    assert.strictEqual(r.status, 401);
  }
  assert.strictEqual((await svc.getDoctorView({ actor: doctor, orderId: b.id })).order.status, S.BOOKED);
});

await t('webhook: no secret configured refuses (no default secret)', async () => {
  const saved = process.env.HLTHSTACK_WEBHOOK_SECRET;
  delete process.env.HLTHSTACK_WEBHOOK_SECRET;
  const svc = fresh();
  const raw = '{}';
  const r = await handleDiagnosticsWebhook({ rawBody: raw, signatureHeader: sign(raw, '') }, { service: svc });
  assert.strictEqual(r.status, 503);
  if (saved !== undefined) process.env.HLTHSTACK_WEBHOOK_SECRET = saved;
});

await t('webhook: oversize body rejected (core and stream)', async () => {
  const svc = fresh();
  const big = JSON.stringify({ pad: 'x'.repeat(70000) });
  const r = await handleDiagnosticsWebhook({ rawBody: big, signatureHeader: sign(big) }, { service: svc, secret: SECRET });
  assert.strictEqual(r.status, 413);
  const handler = createDiagnosticsWebhookHandler({ service: svc, secret: SECRET });
  const req = Readable.from([Buffer.from(big)]); req.method = 'POST'; req.headers = { 'x-hlthstack-signature': sign(big) };
  let out;
  const res = { writeHead(s) { this.status = s; }, end(b) { out = { status: this.status, body: JSON.parse(b) }; } };
  await handler(req, res);
  assert.strictEqual(out.status, 413);
  // normal stream path works, wrong method rejected
  const b = await mkBooked(svc);
  const raw = JSON.stringify(svc._provider.buildEvent('sample_collected', b.booking.providerBookingId));
  const req2 = Readable.from([Buffer.from(raw)]); req2.method = 'POST'; req2.headers = { 'x-hlthstack-signature': sign(raw) };
  await handler(req2, res);
  assert.strictEqual(out.status, 200);
  const req3 = Readable.from([]); req3.method = 'GET'; req3.headers = {};
  await handler(req3, res);
  assert.strictEqual(out.status, 405);
});

await t('firestore.rules covers diagnostic orders and results', async () => {
  const rules = fs.readFileSync('./firestore.rules', 'utf8');
  assert.ok(rules.includes('diagnosticOrders') && rules.includes('diagnosticResults'));
  assert.ok(/diagnosticResults[\s\S]*allow write: if false/.test(rules));
});

console.log(`\nAll ${passed} diagnostics test groups passed (synthetic data, mock provider).`);
