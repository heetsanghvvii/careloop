// Shared Project Vial service for the demo screens. MOCK provider and localStorage only.
// A separate storage key is used so demo orders never share an object with the app's main demo data.
import {
  createDiagnosticsService,
  createLocalStorageStore,
  generateMockReport,
  listCatalog,
  CONSENT_VERSION
} from '../../diagnostics/index.js';

export const VIAL_STORAGE_KEY = 'careloop_vial_diagnostics_v1';
export const SYNTHETIC_BANNER = 'Synthetic demo data. No real lab, no real patient.';
export const PLACEHOLDER_CONSENT =
  'I agree that a sample may be collected at my home for the tests my doctor has ordered, and that my ' +
  'doctor will review the report before I can see it. I understand this is a demonstration with no real lab.';
export const CONSENT_DRAFT_NOTE = 'Draft consent, not legally reviewed.';
export { CONSENT_VERSION };

let service = null;
export const getVialService = () => {
  if (!service) service = createDiagnosticsService({ store: createLocalStorageStore(VIAL_STORAGE_KEY) });
  return service;
};

export const getCatalog = () => listCatalog();

/** Build a mock provider event from an order that already has a booking. Synthetic report only. */
export const buildDemoEvent = (type, order) => {
  const pbid = order.booking.providerBookingId;
  const event = { eventId: `${pbid}:${type}`, type, providerBookingId: pbid, occurredAt: new Date().toISOString() };
  if (type === 'report_ready') event.report = generateMockReport(order.tests.map(t => t.code), pbid);
  if (type === 'collection_failed') event.reason = 'Demo: collection failed';
  return event;
};

export const errMsg = (e) => (e && e.message ? e.message : 'Something went wrong');
