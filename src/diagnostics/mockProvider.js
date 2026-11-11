/**
 * Deterministic mock diagnostics provider. SYNTHETIC DATA ONLY.
 * Nothing here talks to a network or to hlthstack.
 */
import { getCatalogTest } from './catalog.js';

// Serviceable 3-digit pincode prefixes (mock coverage).
export const MOCK_COVERAGE = Object.freeze({ '560': 'Bengaluru', '400': 'Mumbai', '110': 'Delhi' });

export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic synthetic report for the given test codes. Output includes synthetic: true. */
export function generateMockReport(testCodes, seed = '') {
  const results = testCodes.map(code => {
    const t = getCatalogTest(code);
    if (!t) throw new Error(`Mock report: unknown test ${code}`);
    return {
      testCode: code,
      parameters: t.parameters.map(p => {
        const lo = p.low ?? p.high * 0.4;
        const span = p.high - lo;
        const frac = (hashString(`${seed}:${code}:${p.code}`) % 1000) / 1000;
        const raw = lo - span * 0.1 + frac * span * 1.2;
        const value = Number(raw.toFixed(p.decimals));
        const text = p.low == null ? `<${p.high}` : `${p.low} - ${p.high}`;
        return { code: p.code, name: p.name, value, unit: p.unit, reference: { low: p.low, high: p.high, text } };
      })
    };
  });
  return { providerReportId: `MOCKRPT-${hashString(seed).toString(16)}`, synthetic: true, results };
}

export function createMockProvider(options = {}) {
  const bookings = new Map();
  const failOn = options.failCreateBooking === true;

  const provider = {
    name: 'mock',

    checkServiceability(pincode) {
      if (typeof pincode !== 'string' || !/^[1-9]\d{5}$/.test(pincode)) {
        return { serviceable: false, reason: 'invalid_pincode' };
      }
      const city = MOCK_COVERAGE[pincode.slice(0, 3)];
      return city ? { serviceable: true, city } : { serviceable: false, reason: 'not_serviceable' };
    },

    getSlots(pincode, dateISO) {
      if (!provider.checkServiceability(pincode).serviceable) return [];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO || '')) return [];
      return [['07:00', '09:00'], ['09:00', '11:00'], ['16:00', '18:00']].map(([start, end]) => ({
        slotId: `${dateISO}T${start}`, date: dateISO, start, end
      }));
    },

    createBooking({ idempotencyKey, orderRef, tests, pincode, collection, slot }) {
      if (failOn) throw new Error('mock provider: createBooking failure injected');
      if (collection !== 'home') throw new Error('mock provider supports collection=home only');
      if (!provider.checkServiceability(pincode).serviceable) throw new Error('not_serviceable');
      const providerBookingId = `MOCKBK-${hashString(idempotencyKey || orderRef).toString(16)}`;
      if (!bookings.has(providerBookingId)) {
        bookings.set(providerBookingId, { providerBookingId, orderRef, tests: [...tests], pincode, slot, state: 'confirmed' });
      }
      return { providerBookingId };
    },

    cancelBooking(providerBookingId) {
      const b = bookings.get(providerBookingId);
      if (!b) return { cancelled: false, reason: 'unknown_booking' };
      if (b.state !== 'confirmed') return { cancelled: false, reason: `already_${b.state}` };
      b.state = 'cancelled';
      return { cancelled: true };
    },

    /** Build a normalised provider event (what a real adapter would emit from a webhook payload). */
    buildEvent(type, providerBookingId, occurredAt = '2026-01-01T00:00:00.000Z') {
      const b = bookings.get(providerBookingId);
      const event = { eventId: `${providerBookingId}:${type}`, type, providerBookingId, occurredAt };
      if (type === 'report_ready') {
        if (!b) throw new Error('mock provider: unknown booking');
        event.report = generateMockReport(b.tests, providerBookingId);
      }
      if (b) {
        if (type === 'sample_collected') b.state = 'collected';
        if (type === 'booking_cancelled') b.state = 'cancelled';
      }
      return event;
    },

    /** Happy-path event sequence for a booking. */
    happyPathEvents(providerBookingId) {
      return ['sample_collected', 'report_ready'].map(t => provider.buildEvent(t, providerBookingId));
    },

    _bookings: bookings
  };
  return provider;
}
