// Careloop Follow-Up Booking Engine (PROTOTYPE - synthetic scheduling, no real calendar writes)
// Semantics: a rule says "check after N days" from an anchor date (day 0 = the visit/program day
// the doctor set it). The trigger fires on day N-1 ("day 6" for N=7) and proposes a slot on day N
// ("day 7"). All slots are stored as UTC ISO instants and displayed in the doctor's timezone.

export const DEFAULT_TZ = 'Asia/Calcutta';
export const DEFAULT_AVAILABILITY = [
  // Mon(1) - Sat(6), 09:00-13:00 and 15:00-19:00 doctor-local
  ...[1, 2, 3, 4, 5, 6].flatMap(weekday => ([
    { weekday, startMin: 9 * 60, endMin: 13 * 60 },
    { weekday, startMin: 15 * 60, endMin: 19 * 60 },
  ])),
];

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function todayInTz(tz = DEFAULT_TZ) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  return `${g('year')}-${g('month')}-${g('day')}`;
}

// "Check after N days" anchored on day 0 -> trigger on day N-1, slot on day N.
export function computeTriggerDate(anchorDateStr, intervalDays) {
  return addDays(anchorDateStr, intervalDays - 1);
}
export function computeSlotDate(anchorDateStr, intervalDays) {
  return addDays(anchorDateStr, intervalDays);
}

export function weekdayOfDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun
}

// Convert a doctor-local wall time (dateStr + minutes after midnight) to a UTC Date.
export function zonedTimeToUtc(dateStr, minutes, tz = DEFAULT_TZ) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, 0, 0) + minutes * 60000;
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const p = Object.fromEntries(dtf.formatToParts(new Date(guess)).map(x => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour === 24 ? 0 : +p.hour, +p.minute, +p.second);
  return new Date(guess - (asUtc - guess));
}

export function formatSlotInTz(isoInstant, tz = DEFAULT_TZ) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' }).format(new Date(isoInstant));
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// First available slot of durationMin on dateStr (doctor-local) within availability windows,
// skipping overlaps with existing bookings [{startISO, endISO}]. Steps in 15-min increments.
export function findAvailableSlot({ dateStr, durationMin, availability = DEFAULT_AVAILABILITY, bookings = [], tz = DEFAULT_TZ }) {
  const weekday = weekdayOfDate(dateStr);
  const windows = availability.filter(w => w.weekday === weekday).sort((a, b) => a.startMin - b.startMin);
  for (const w of windows) {
    for (let start = w.startMin; start + durationMin <= w.endMin; start += 15) {
      const s = zonedTimeToUtc(dateStr, start, tz);
      const e = zonedTimeToUtc(dateStr, start + durationMin, tz);
      const clash = bookings.some(b => overlaps(s, e, new Date(b.startISO), new Date(b.endISO)));
      if (!clash) return { startISO: s.toISOString(), endISO: e.toISOString(), dateStr };
    }
  }
  return null;
}

export function makeIdempotencyKey(ruleId, slotDateStr) {
  return `${ruleId}:${slotDateStr}`;
}

// Base key (without #cycle suffix) so duplicate detection spans cycles.
export function baseKey(key) {
  return key.split('#')[0];
}

// Search the doctor-requested clinical window: from slotDate for rule.windowDays days
// (default 1 = the requested day only). Patient-facing automation never books outside
// this window; when nothing fits, the event goes to needs_doctor_review instead.
export function findSlotInWindow({ rule, slotDateStr, calendar, tz = DEFAULT_TZ, fromDateStr = null }) {
  const windowDays = Math.max(1, rule.windowDays || 1);
  const windowEnd = addDays(slotDateStr, windowDays - 1);
  let d = fromDateStr && fromDateStr > slotDateStr ? fromDateStr : slotDateStr;
  while (d <= windowEnd) {
    const slot = findAvailableSlot({ dateStr: d, durationMin: rule.durationMin, availability: calendar.availability, bookings: calendar.bookings, tz });
    if (slot) return { slot, windowEnd, outsideWindow: false };
    d = addDays(d, 1);
  }
  return { slot: null, windowEnd, outsideWindow: true };
}

// Idempotent proposal: one active event per (rule, slotDate). Re-running the trigger for the
// same cycle returns the existing event instead of double-booking.
export function proposeEvent({ rule, anchorDateStr, calendar, existingEvents = [], nowISO, tz = DEFAULT_TZ }) {
  const slotDateStr = computeSlotDate(anchorDateStr, rule.intervalDays);
  const base = makeIdempotencyKey(rule.id, slotDateStr);
  const dup = existingEvents.find(ev => baseKey(ev.idempotencyKey) === base && !['cancelled', 'opted_out'].includes(ev.status));
  if (dup) return { event: dup, created: false };
  // Cycle count keeps keys unique across re-triggers after a cancelled/opted-out event.
  const cycle = existingEvents.filter(ev => baseKey(ev.idempotencyKey) === base).length + 1;
  const key = `${base}#${cycle}`;
  const { slot, windowEnd } = findSlotInWindow({ rule, slotDateStr, calendar, tz });
  const ev = {
    id: 'fue_' + Math.random().toString(36).slice(2, 10),
    ruleId: rule.id,
    participantId: rule.participantId,
    idempotencyKey: key,
    cycle,
    anchorDate: anchorDateStr,
    triggerDate: computeTriggerDate(anchorDateStr, rule.intervalDays),
    requestedSlotDate: slotDateStr,
    windowEnd,
    durationMin: rule.durationMin,
    timezone: tz,
    createdAt: nowISO,
    updatedAt: nowISO,
    history: [{ at: nowISO, actor: 'system', action: 'trigger_fired', detail: `Day ${rule.intervalDays - 1} trigger for day-${rule.intervalDays} follow-up (anchor ${anchorDateStr})` }],
  };
  if (!slot) {
    return { created: true, event: { ...ev, status: 'needs_doctor_review', proposedSlotStart: null, proposedSlotEnd: null, history: [...ev.history, { at: nowISO, actor: 'system', action: 'no_slot_in_window', detail: `No free ${rule.durationMin}-min slot in requested window ${slotDateStr}..${windowEnd} - doctor review needed` }] } };
  }
  return { created: true, event: { ...ev, status: 'awaiting_patient', proposedSlotStart: slot.startISO, proposedSlotEnd: slot.endISO, history: [...ev.history, { at: nowISO, actor: 'system', action: 'slot_proposed', detail: `Proposed ${formatSlotInTz(slot.startISO, tz)}` }] } };
}

// Patient response. confirm: booking is added to the (synthetic) doctor calendar.
// decline: automatically propose the next available day. optout: rule deactivated.
export function applyPatientResponse({ event, response, rule, calendar, nowISO, tz = DEFAULT_TZ }) {
  if (event.status !== 'awaiting_patient') return { event, calendar, error: `Cannot respond to event in status ${event.status}` };
  const hist = a => [...event.history, { at: nowISO, actor: 'patient', ...a }];
  if (response === 'confirm') {
    // Re-check availability at confirmation time: two pending proposals can target the same
    // slot; only the first confirmation may write the booking.
    const clash = calendar.bookings.some(b => {
      const s = new Date(b.startISO), e = new Date(b.endISO);
      return new Date(event.proposedSlotStart) < e && s < new Date(event.proposedSlotEnd);
    });
    if (clash) {
      const { slot, windowEnd } = findSlotInWindow({ rule: { ...rule, durationMin: event.durationMin }, slotDateStr: event.requestedSlotDate, calendar, tz, fromDateStr: event.proposedSlotStart.slice(0, 10) });
      if (!slot) {
        return { event: { ...event, status: 'needs_doctor_review', proposedSlotStart: null, proposedSlotEnd: null, updatedAt: nowISO, history: hist({ action: 'confirmation_conflict_no_slot', detail: 'Slot taken by another confirmation; nothing left in window - doctor review needed' }) }, calendar };
      }
      return { event: { ...event, status: 'awaiting_patient', proposedSlotStart: slot.startISO, proposedSlotEnd: slot.endISO, updatedAt: nowISO, history: hist({ action: 'confirmation_conflict_reproposed', detail: `Slot was just taken; re-proposed ${formatSlotInTz(slot.startISO, tz)} (window ends ${windowEnd})` }) }, calendar };
    }
    const booking = { id: 'bk_' + event.id, startISO: event.proposedSlotStart, endISO: event.proposedSlotEnd, title: 'Follow-up visit (synthetic)', source: 'follow-up-prototype' };
    return { event: { ...event, status: 'confirmed', confirmedSlotStart: event.proposedSlotStart, updatedAt: nowISO, history: hist({ action: 'patient_confirmed', detail: 'Patient confirmed proposed slot' }) }, calendar: { ...calendar, bookings: [...calendar.bookings, booking] } };
  }
  if (response === 'decline') {
    // Auto re-proposal stays inside the doctor-requested window; outside it, escalate.
    const nextDate = addDays(event.proposedSlotStart ? event.proposedSlotStart.slice(0, 10) : event.requestedSlotDate, 1);
    const { slot, windowEnd } = findSlotInWindow({ rule: { ...rule, durationMin: event.durationMin }, slotDateStr: event.requestedSlotDate, calendar, tz, fromDateStr: nextDate });
    if (!slot) return { event: { ...event, status: 'needs_doctor_review', proposedSlotStart: null, proposedSlotEnd: null, updatedAt: nowISO, history: hist({ action: 'patient_declined_needs_review', detail: `Declined; no slot left in requested window (ends ${windowEnd}) - doctor review needed` }) }, calendar };
    return { event: { ...event, status: 'awaiting_patient', proposedSlotStart: slot.startISO, proposedSlotEnd: slot.endISO, updatedAt: nowISO, history: hist({ action: 'patient_declined_reproposed', detail: `Declined; re-proposed ${formatSlotInTz(slot.startISO, tz)} within requested window` }) }, calendar };
  }
  if (response === 'optout') {
    return { event: { ...event, status: 'opted_out', updatedAt: nowISO, history: hist({ action: 'patient_opted_out', detail: 'Patient opted out of automatic follow-up booking' }) }, calendar, deactivateRule: true };
  }
  return { event, calendar, error: `Unknown response ${response}` };
}

// Doctor actions. cancel: frees any confirmed booking. reschedule: pick first slot on/after targetDateStr.
export function doctorCancel({ event, calendar, nowISO }) {
  if (['cancelled', 'opted_out'].includes(event.status)) return { event, calendar, error: 'Already closed' };
  const bookings = calendar.bookings.filter(b => b.id !== 'bk_' + event.id);
  return { event: { ...event, status: 'cancelled', updatedAt: nowISO, history: [...event.history, { at: nowISO, actor: 'doctor', action: 'doctor_cancelled', detail: 'Doctor cancelled the follow-up' }] }, calendar: { ...calendar, bookings } };
}

export function doctorReschedule({ event, calendar, targetDateStr, nowISO, tz = DEFAULT_TZ }) {
  if (!['awaiting_patient', 'confirmed', 'no_slot_available', 'needs_doctor_review'].includes(event.status)) return { event, calendar, error: `Cannot reschedule from status ${event.status}` };
  const bookings = calendar.bookings.filter(b => b.id !== 'bk_' + event.id);
  const slot = findAvailableSlot({ dateStr: targetDateStr, durationMin: event.durationMin, availability: calendar.availability, bookings, tz });
  if (!slot) return { event: { ...event, status: 'needs_doctor_review', proposedSlotStart: null, proposedSlotEnd: null, updatedAt: nowISO, history: [...event.history, { at: nowISO, actor: 'doctor', action: 'reschedule_no_slot', detail: `No slot on ${targetDateStr}` }] }, calendar: { ...calendar, bookings } };
  const outsideWindow = event.windowEnd && targetDateStr > event.windowEnd;
  const status = 'awaiting_patient'; // doctor override always re-requests patient confirmation
  return { event: { ...event, status, proposedSlotStart: slot.startISO, proposedSlotEnd: slot.endISO, updatedAt: nowISO, history: [...event.history, { at: nowISO, actor: 'doctor', action: 'doctor_rescheduled', detail: `Moved to ${formatSlotInTz(slot.startISO, tz)}${outsideWindow ? ' - OUTSIDE requested window (doctor override)' : ''} (patient re-confirmation needed)` }] }, calendar: { ...calendar, bookings } };
}
