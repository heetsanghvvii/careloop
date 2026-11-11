/**
 * Diagnostics order lifecycle (provider-agnostic state machine).
 *
 * HARD PRODUCT RULE: the system never creates, suggests or schedules a test or retest by itself.
 * The only code path that creates an order is createOrder(), which requires an explicit doctor actor.
 * Provider events can never create an order. There is no recurrence, suggestion or auto-retest API.
 * Patient-facing output carries value, unit and reference range as reported, and no interpretation text.
 *
 * Status flow:
 *   ordered -> booked -> collected -> reported (reviewState: pending_review) -> released
 *   ordered|booked -> cancelled ; booked -> failed (collection_failed) ; booked -> cancelled (provider)
 *   cancelled, failed, released are terminal. A retry is a NEW order created explicitly by a doctor.
 *
 * Actors: { role: 'doctor'|'patient', uid, workspaceId, participantId? }
 */
import { assertProvider, EVENT_TYPES } from './providerInterface.js';
import { getCatalogTest } from './catalog.js';
import { createMemoryStore } from './store.js';
import { createMockProvider } from './mockProvider.js';

export const ORDER_STATUS = Object.freeze({
  ORDERED: 'ordered', BOOKED: 'booked', COLLECTED: 'collected', REPORTED: 'reported',
  RELEASED: 'released', CANCELLED: 'cancelled', FAILED: 'failed'
});
const S = ORDER_STATUS;

/** Provider event type -> { from: allowed statuses, to } */
export const EVENT_TRANSITIONS = Object.freeze({
  sample_collected: { from: [S.BOOKED], to: S.COLLECTED },
  report_ready: { from: [S.COLLECTED], to: S.REPORTED },
  collection_failed: { from: [S.BOOKED], to: S.FAILED },
  booking_cancelled: { from: [S.BOOKED], to: S.CANCELLED }
});

export const CONSENT_VERSION = 'v0-draft-NOT-LEGALLY-REVIEWED';
const FORBIDDEN_ORDER_FIELDS = ['recurrence', 'repeat', 'retestAfter', 'autoRetest', 'suggestedBy', 'schedule'];

export class DiagnosticsError extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = 'DiagnosticsError';
    this.code = code;
  }
}
const fail = (code, msg) => { throw new DiagnosticsError(code, msg); };

export function createDiagnosticsService({ store = createMemoryStore(), provider = createMockProvider(), clock = () => new Date().toISOString(), idGen } = {}) {
  assertProvider(provider);
  let counter = 0;
  const newId = idGen || (() => `dx_${Date.now().toString(36)}_${(++counter).toString(36)}`);

  const requireDoctor = (actor, workspaceId) => {
    if (!actor || actor.role !== 'doctor' || !actor.uid) fail('DOCTOR_ONLY', 'Only a doctor can perform this action');
    if (workspaceId && actor.workspaceId !== workspaceId) fail('WORKSPACE_MISMATCH', 'Actor is not in this workspace');
  };
  const loadOrder = async id => (await store.getOrder(id)) || fail('ORDER_NOT_FOUND', `No order ${id}`);
  const isOwnerPatient = (actor, order) =>
    actor && actor.role === 'patient' && actor.workspaceId === order.workspaceId && actor.participantId === order.participantId;
  const move = (order, to, by, reason) => {
    const at = clock();
    order.history.push({ at, from: order.status, to, by, reason: reason || null });
    order.status = to;
    order.updatedAt = at;
  };

  /** createOrder({ actor, doctorId, participantId, workspaceId, tests: string[], dueDate?, doctorNote? }) -> order */
  async function createOrder(input) {
    const { actor, doctorId, participantId, workspaceId, tests, dueDate, doctorNote } = input || {};
    requireDoctor(actor, workspaceId);
    if (!doctorId || actor.uid !== doctorId) fail('DOCTOR_MISMATCH', 'doctorId must be the acting doctor');
    if (!participantId) fail('PARTICIPANT_REQUIRED');
    if (!workspaceId) fail('WORKSPACE_REQUIRED');
    for (const f of FORBIDDEN_ORDER_FIELDS) {
      if (f in input) fail('FORBIDDEN_FIELD', `Field "${f}" is not allowed: tests and retests are never scheduled by the system`);
    }
    if (!Array.isArray(tests) || tests.length === 0) fail('TESTS_REQUIRED', 'At least one test is required');
    const unique = [...new Set(tests)];
    for (const code of unique) if (!getCatalogTest(code)) fail('UNKNOWN_TEST', `Unknown test ${code}`);
    if (dueDate != null && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) fail('BAD_DUE_DATE', 'dueDate must be YYYY-MM-DD');
    const at = clock();
    const order = {
      id: newId(), workspaceId, participantId, doctorId,
      status: S.ORDERED,
      tests: unique.map(c => ({ code: c, name: getCatalogTest(c).name })),
      dueDate: dueDate || null,
      doctorNote: doctorNote || '',
      origin: 'doctor_explicit',
      createdAt: at, updatedAt: at,
      createdBy: { uid: actor.uid, role: 'doctor' },
      consent: null, booking: null,
      collectedAt: null, reportedAt: null, reviewState: null, releasedAt: null, releasedBy: null, releaseNote: '',
      cancelledAt: null, cancelledBy: null, cancelReason: null, failedReason: null,
      processedEventIds: [],
      history: [{ at, from: null, to: S.ORDERED, by: actor.uid, reason: null }]
    };
    return store.putOrder(order);
  }

  /**
   * bookOrder({ actor, orderId, slot: {slotId,date}, pincode, consent: { given: true } }) -> order
   * Patient only (own order). Requires recorded consent, a serviceable pincode and a valid slot.
   */
  async function bookOrder({ actor, orderId, slot, pincode, consent } = {}) {
    const order = await loadOrder(orderId);
    if (!isOwnerPatient(actor, order)) fail('NOT_ORDER_PATIENT', 'Only the ordered patient can book');
    if (order.status !== S.ORDERED) fail('INVALID_TRANSITION', `Cannot book an order in status ${order.status}`);
    if (!consent || consent.given !== true) fail('CONSENT_REQUIRED', 'Recorded consent is required to book');
    const svc = await provider.checkServiceability(pincode);
    if (!svc.serviceable) fail('NOT_SERVICEABLE', `Pincode not serviceable (${svc.reason || 'unknown'})`);
    const slots = await provider.getSlots(pincode, slot?.date);
    const chosen = slots.find(s => s.slotId === slot?.slotId);
    if (!chosen) fail('SLOT_UNAVAILABLE', 'Selected slot is not available');
    let res;
    try {
      res = await provider.createBooking({
        idempotencyKey: order.id, orderRef: order.id, tests: order.tests.map(t => t.code),
        pincode, collection: 'home', slot: chosen
      });
    } catch (err) {
      fail('PROVIDER_ERROR', `Provider booking failed: ${err.message}`);
    }
    const at = clock();
    order.consent = { given: true, version: CONSENT_VERSION, givenAt: at, givenBy: actor.uid };
    order.booking = {
      providerName: provider.name, providerBookingId: res.providerBookingId,
      pincode, slot: chosen, collection: 'home', bookedAt: at
    };
    move(order, S.BOOKED, actor.uid);
    return store.putOrder(order);
  }

  /**
   * applyProviderEvent(event) -> { applied: boolean, duplicate: boolean, order }
   * event: { eventId, type, providerBookingId, occurredAt, report? }
   * Idempotent on eventId. Rejects unknown types, unknown bookings, out-of-order transitions.
   * Never creates an order.
   */
  async function applyProviderEvent(event) {
    if (!event || !event.eventId || !event.providerBookingId) fail('BAD_EVENT', 'eventId and providerBookingId are required');
    if (!EVENT_TYPES.includes(event.type)) fail('UNKNOWN_EVENT_TYPE', `Unknown event type ${event.type}`);
    const order = await store.findOrderByProviderBookingId(event.providerBookingId);
    if (!order) fail('UNKNOWN_BOOKING', 'No order for this provider booking');
    if (order.processedEventIds.includes(event.eventId)) return { applied: false, duplicate: true, order };
    const rule = EVENT_TRANSITIONS[event.type];
    if (!rule.from.includes(order.status)) {
      fail('OUT_OF_ORDER', `Event ${event.type} not valid while order is ${order.status}`);
    }
    if (event.type === 'report_ready') {
      const report = sanitizeReport(event.report, order);
      await store.putResult(order.id, { orderId: order.id, workspaceId: order.workspaceId, participantId: order.participantId, ...report, receivedAt: clock() });
      order.reportedAt = clock();
      order.reviewState = 'pending_review';
    }
    if (event.type === 'sample_collected') order.collectedAt = event.occurredAt || clock();
    if (event.type === 'collection_failed') order.failedReason = event.reason || 'collection_failed';
    if (event.type === 'booking_cancelled') {
      order.cancelledAt = clock(); order.cancelledBy = 'provider'; order.cancelReason = event.reason || 'provider_cancelled';
    }
    order.processedEventIds.push(event.eventId);
    move(order, rule.to, 'provider', event.type);
    await store.putOrder(order);
    return { applied: true, duplicate: false, order };
  }

  /** releaseReport({ actor, orderId, releaseNote? }) -> order. Doctor of the order's workspace only. */
  async function releaseReport({ actor, orderId, releaseNote } = {}) {
    const order = await loadOrder(orderId);
    requireDoctor(actor, order.workspaceId);
    if (order.status !== S.REPORTED) fail('INVALID_TRANSITION', `Cannot release an order in status ${order.status}`);
    order.releasedAt = clock();
    order.releasedBy = actor.uid;
    order.releaseNote = releaseNote || '';
    order.reviewState = 'released';
    move(order, S.RELEASED, actor.uid);
    return store.putOrder(order);
  }

  /** cancelOrder({ actor, orderId, reason? }) -> order. Doctor (workspace) or the ordered patient; ordered|booked only. */
  async function cancelOrder({ actor, orderId, reason } = {}) {
    const order = await loadOrder(orderId);
    const doctor = actor?.role === 'doctor' && actor.workspaceId === order.workspaceId;
    if (!doctor && !isOwnerPatient(actor, order)) fail('NOT_AUTHORIZED', 'Not allowed to cancel this order');
    if (![S.ORDERED, S.BOOKED].includes(order.status)) fail('INVALID_TRANSITION', `Cannot cancel an order in status ${order.status}`);
    if (order.status === S.BOOKED) {
      const r = await provider.cancelBooking(order.booking.providerBookingId);
      if (!r.cancelled) fail('PROVIDER_CANCEL_REFUSED', `Provider refused cancellation (${r.reason || 'unknown'})`);
    }
    order.cancelledAt = clock();
    order.cancelledBy = actor.uid;
    order.cancelReason = reason || null;
    move(order, S.CANCELLED, actor.uid, reason);
    return store.putOrder(order);
  }

  /** getPatientView({ actor, orderId }) -> patient-safe view. results is null until released. */
  async function getPatientView({ actor, orderId } = {}) {
    const order = await loadOrder(orderId);
    if (!isOwnerPatient(actor, order)) fail('NOT_ORDER_PATIENT', 'Not your order');
    const view = {
      id: order.id, status: order.status, statusLabel: PATIENT_LABELS[order.status],
      tests: order.tests, dueDate: order.dueDate, doctorNote: order.doctorNote,
      booking: order.booking && { slot: order.booking.slot, pincode: order.booking.pincode, collection: order.booking.collection },
      reportAvailable: order.status === S.RELEASED, results: null, releaseNote: null
    };
    if (order.status === S.RELEASED) {
      const r = await store.getResult(order.id);
      view.results = r ? r.results : null;
      view.releaseNote = order.releaseNote;
    }
    return view;
  }

  /** getDoctorView({ actor, orderId }) -> full order plus results (if any) and reviewState. */
  async function getDoctorView({ actor, orderId } = {}) {
    const order = await loadOrder(orderId);
    requireDoctor(actor, order.workspaceId);
    const result = await store.getResult(order.id);
    return { order, results: result ? result.results : null, pendingReview: order.status === S.REPORTED };
  }

  /** listPatientOrders({ actor }) -> patient views for the actor's own orders. */
  async function listPatientOrders({ actor } = {}) {
    if (actor?.role !== 'patient') fail('NOT_AUTHORIZED');
    const own = await store.listOrders(o => o.workspaceId === actor.workspaceId && o.participantId === actor.participantId);
    return Promise.all(own.map(o => getPatientView({ actor, orderId: o.id })));
  }

  /** listDoctorOrders({ actor, status? }) -> orders in the doctor's workspace. */
  async function listDoctorOrders({ actor, status } = {}) {
    requireDoctor(actor);
    return store.listOrders(o => o.workspaceId === actor.workspaceId && (!status || o.status === status));
  }

  return {
    createOrder, bookOrder, applyProviderEvent, releaseReport, cancelOrder,
    getPatientView, getDoctorView, listPatientOrders, listDoctorOrders,
    checkServiceability: pin => provider.checkServiceability(pin),
    getSlots: (pin, date) => provider.getSlots(pin, date),
    _store: store, _provider: provider
  };
}

const PATIENT_LABELS = {
  ordered: 'Ordered by your doctor', booked: 'Collection booked', collected: 'Sample collected',
  reported: 'Report received, awaiting your doctor', released: 'Report released',
  cancelled: 'Cancelled', failed: 'Collection could not be completed'
};

/** Whitelist report fields: value, unit, reference range only. Drops any flag or interpretation text. */
function sanitizeReport(report, order) {
  if (!report || !Array.isArray(report.results) || report.results.length === 0) fail('BAD_REPORT', 'report.results required');
  const ordered = new Set(order.tests.map(t => t.code));
  const results = report.results.map(r => {
    if (!ordered.has(r.testCode)) fail('BAD_REPORT', `Result for test not ordered: ${r.testCode}`);
    if (!Array.isArray(r.parameters) || r.parameters.length === 0) fail('BAD_REPORT', 'parameters required');
    return {
      testCode: r.testCode,
      parameters: r.parameters.map(p => {
        if (p.value === undefined || p.value === null || !p.unit) fail('BAD_REPORT', 'each parameter needs value and unit');
        const ref = p.reference || {};
        return {
          code: p.code, name: p.name, value: p.value, unit: p.unit,
          reference: { low: ref.low ?? null, high: ref.high ?? null, text: ref.text ?? '' }
        };
      })
    };
  });
  return { providerReportId: report.providerReportId || null, synthetic: report.synthetic === true, results };
}
