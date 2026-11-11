/**
 * Provider adapter interface (ASSUMED shape; hlthstack's real API is unknown).
 *
 * A provider is a plain object with these async-or-sync methods:
 *
 *  name: string
 *  checkServiceability(pincode) -> { serviceable: boolean, reason?: string, city?: string }
 *  getSlots(pincode, dateISO 'YYYY-MM-DD') -> [{ slotId, date, start 'HH:MM', end 'HH:MM' }]
 *  createBooking({ idempotencyKey, orderRef, tests: string[], pincode, collection: 'home', slot })
 *      -> { providerBookingId: string }
 *  cancelBooking(providerBookingId) -> { cancelled: boolean, reason?: string }
 *
 * Status updates and reports arrive as webhook events, normalised by the adapter to:
 *  { eventId, type, providerBookingId, occurredAt, report? }
 *  type is one of: sample_collected | report_ready | collection_failed | booking_cancelled
 *  report (only on report_ready): { providerReportId?, results: [{ testCode, parameters:
 *      [{ code, name, value, unit, reference: { low, high, text } }] }] }
 */
export const PROVIDER_METHODS = ['checkServiceability', 'getSlots', 'createBooking', 'cancelBooking'];

export function assertProvider(provider) {
  if (!provider || typeof provider.name !== 'string') throw new Error('Provider must have a name');
  for (const m of PROVIDER_METHODS) {
    if (typeof provider[m] !== 'function') throw new Error(`Provider "${provider.name}" is missing method ${m}`);
  }
  return provider;
}

export const EVENT_TYPES = Object.freeze(['sample_collected', 'report_ready', 'collection_failed', 'booking_cancelled']);
