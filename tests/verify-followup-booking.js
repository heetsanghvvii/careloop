// Careloop Follow-Up Booking Engine Test Suite (synthetic scheduling prototype)
import {
  DEFAULT_AVAILABILITY, addDays, todayInTz, computeTriggerDate, computeSlotDate,
  zonedTimeToUtc, formatSlotInTz, findAvailableSlot, findSlotInWindow,
  proposeEvent, applyPatientResponse, doctorCancel, doctorReschedule, makeIdempotencyKey, baseKey
} from '../src/data/followUpScheduler.js';

let passed = 0;
const ok = (cond, msg) => { if (!cond) { console.error('❌ ' + msg); process.exit(1); } passed++; console.log('✅ ' + msg); };
const NOW = '2026-10-25T12:00:00.000Z';
const emptyCal = () => ({ timezone: 'Asia/Calcutta', availability: DEFAULT_AVAILABILITY, bookings: [] });

console.log('📅 Starting Follow-Up Booking Engine Test Suite...');

// [1-2] Due-vs-booking-trigger distinction: "check after 7 days" anchored day 0
ok(computeTriggerDate('2026-10-20', 7) === '2026-10-26', 'Day-6 trigger date for 7-day interval (anchor 2026-10-20)');
ok(computeSlotDate('2026-10-20', 7) === '2026-10-27', 'Day-7 slot date for 7-day interval');

// [3] Configurable interval
ok(computeTriggerDate('2026-10-20', 14) === '2026-11-02' && computeSlotDate('2026-10-20', 14) === '2026-11-03', 'Configurable 14-day interval: trigger day 13, slot day 14');

// [4] UI-demo fixture (same anchor the Simulate button uses): today 2026-10-25 => anchor 2026-10-19, trigger today, slot tomorrow 2026-10-26
{
  const anchor = addDays('2026-10-25', -(7 - 1));
  ok(anchor === '2026-10-19' && computeTriggerDate(anchor, 7) === '2026-10-25' && computeSlotDate(anchor, 7) === '2026-10-26', 'UI demo fixture: anchor 10-19 -> trigger 10-25 (today), slot 10-26 - no off-by-one');
  const p = proposeEvent({ rule: { id: 'fur_ui', participantId: 'part_ui', intervalDays: 7, durationMin: 20, active: true }, anchorDateStr: anchor, calendar: emptyCal(), existingEvents: [], nowISO: NOW });
  ok(p.event.proposedSlotStart.startsWith('2026-10-26') && /26 Oct, 2026/.test(formatSlotInTz(p.event.proposedSlotStart, 'Asia/Calcutta')), 'Displayed slot string matches fixture date (26 Oct 2026)');
}

// [5-6] Timezone conversion round-trip
ok(zonedTimeToUtc('2026-10-27', 540, 'Asia/Calcutta').toISOString() === '2026-10-27T03:30:00.000Z', 'Timezone: 09:00 IST converts to 03:30 UTC');
ok(/9:00 am IST/.test(formatSlotInTz('2026-10-27T03:30:00.000Z', 'Asia/Calcutta')), 'Slot formats back to 9:00 am IST');

// [7-9] Slot finding: window start, closed Sunday, conflict skip
{
  const cal = emptyCal();
  ok(findAvailableSlot({ dateStr: '2026-10-27', durationMin: 20, availability: cal.availability, bookings: cal.bookings }).startISO === '2026-10-27T03:30:00.000Z', 'First slot at window start (09:00 IST Tue)');
  ok(findAvailableSlot({ dateStr: '2026-10-25', durationMin: 20, availability: cal.availability, bookings: cal.bookings }) === null, 'No slot on closed day (Sunday)');
  const busy = { ...emptyCal(), bookings: [{ id: 'b1', startISO: '2026-10-27T03:30:00.000Z', endISO: '2026-10-27T03:45:00.000Z' }] };
  ok(findAvailableSlot({ dateStr: '2026-10-27', durationMin: 20, availability: busy.availability, bookings: busy.bookings }).startISO === '2026-10-27T03:45:00.000Z', 'Conflict at 09:00 skipped, next slot 09:15 IST');
}

// Fully booked day helper
const fullBookings = [];
for (let m = 540; m < 780; m += 20) fullBookings.push({ id: 'x' + m, startISO: zonedTimeToUtc('2026-10-27', m, 'Asia/Calcutta').toISOString(), endISO: zonedTimeToUtc('2026-10-27', m + 20, 'Asia/Calcutta').toISOString() });
for (let m = 900; m < 1140; m += 20) fullBookings.push({ id: 'y' + m, startISO: zonedTimeToUtc('2026-10-27', m, 'Asia/Calcutta').toISOString(), endISO: zonedTimeToUtc('2026-10-27', m + 20, 'Asia/Calcutta').toISOString() });

// [10] Fully-booked day -> no slot
ok(findAvailableSlot({ dateStr: '2026-10-27', durationMin: 20, availability: DEFAULT_AVAILABILITY, bookings: fullBookings }) === null, 'Fully-booked day returns no slot');

const rule = { id: 'fur_t1', participantId: 'part_t1', intervalDays: 7, durationMin: 20, active: true };

// [11-13] Proposal + idempotency
{
  const p1 = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW });
  ok(p1.created && p1.event.status === 'awaiting_patient' && p1.event.triggerDate === '2026-10-26' && p1.event.requestedSlotDate === '2026-10-27', 'Proposal created with day-6 trigger + requested day-7 slot recorded');
  const p2 = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [p1.event], nowISO: NOW });
  ok(!p2.created && p2.event.id === p1.event.id, 'Idempotent re-trigger returns existing event, no duplicate');
  ok(baseKey(p1.event.idempotencyKey) === makeIdempotencyKey('fur_t1', '2026-10-27') && /#1$/.test(p1.event.idempotencyKey), 'Idempotency key = rule:slotDate#cycle');

  // [14-15] Idempotency cycles: re-trigger after cancel creates a NEW cycle; after confirm returns existing
  const conf = applyPatientResponse({ event: p1.event, response: 'confirm', rule, calendar: emptyCal(), nowISO: NOW });
  const pAgain = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: conf.calendar, existingEvents: [conf.event], nowISO: NOW });
  ok(!pAgain.created, 'Re-trigger after confirm returns the confirmed event (no double-book)');
  const cxl = doctorCancel({ event: conf.event, calendar: conf.calendar, nowISO: NOW });
  const pNew = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: cxl.calendar, existingEvents: [cxl.event], nowISO: NOW });
  ok(pNew.created && /#2$/.test(pNew.event.idempotencyKey) && pNew.event.id !== p1.event.id, 'Re-trigger after cancel creates cycle #2 with unique key (explicit status semantics)');
}

// [16] Two pending proposals, out-of-order confirmations: second must NOT land in the same slot
{
  const cal = emptyCal();
  const ruleB = { ...rule, id: 'fur_t2', participantId: 'part_t2' };
  const a = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: cal, existingEvents: [], nowISO: NOW }).event;
  const b = proposeEvent({ rule: ruleB, anchorDateStr: '2026-10-20', calendar: cal, existingEvents: [a], nowISO: NOW }).event;
  ok(a.proposedSlotStart === b.proposedSlotStart, 'Fixture: both pending proposals target the same 09:00 slot');
  // B confirms FIRST (out of order)
  const confB = applyPatientResponse({ event: b, response: 'confirm', rule: ruleB, calendar: cal, nowISO: NOW });
  ok(confB.event.status === 'confirmed' && confB.calendar.bookings.length === 1, 'First confirmation (B) books the slot');
  // A confirms second: slot is now taken -> must re-propose, not double-book
  const confA = applyPatientResponse({ event: a, response: 'confirm', rule, calendar: confB.calendar, nowISO: NOW });
  ok(confA.event.status === 'awaiting_patient' && confA.event.proposedSlotStart !== b.proposedSlotStart && confA.calendar.bookings.length === 1, 'Confirm-time availability recheck: A re-proposed to a different slot, no double-booking');
  ok(confA.event.proposedSlotStart === '2026-10-27T04:00:00.000Z', 'A re-proposed to next free candidate 09:30 IST (09:15 still overlaps the 20-min booking)');
}

// [17-18] Window semantics: default window = requested day only; decline outside window -> needs_doctor_review
{
  const p = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const dec = applyPatientResponse({ event: p, response: 'decline', rule, calendar: emptyCal(), nowISO: NOW });
  ok(dec.event.status === 'needs_doctor_review' && !dec.event.proposedSlotStart, 'Default window (requested day only): decline leaves window -> needs_doctor_review, no auto next-day');
  const wide = { ...rule, windowDays: 3 };
  const p2 = proposeEvent({ rule: wide, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const dec2 = applyPatientResponse({ event: p2, response: 'decline', rule: wide, calendar: emptyCal(), nowISO: NOW });
  ok(dec2.event.status === 'awaiting_patient' && dec2.event.proposedSlotStart.startsWith('2026-10-28') && dec2.event.windowEnd === '2026-10-29', 'windowDays=3: decline re-proposes next day inside window (ends 10-29)');
}

// [19] No-slot-in-window proposal -> needs_doctor_review (not a crash, not silent)
{
  const pNo = proposeEvent({ rule: { ...rule, id: 'fur_t3' }, anchorDateStr: '2026-10-20', calendar: { ...emptyCal(), bookings: fullBookings }, existingEvents: [], nowISO: NOW });
  ok(pNo.event.status === 'needs_doctor_review' && pNo.event.proposedSlotStart === null, 'No slot in requested window -> needs_doctor_review status');
}

// [20] Patient opt-out closes event + flags rule deactivation
{
  const p = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const opt = applyPatientResponse({ event: p, response: 'optout', rule, calendar: emptyCal(), nowISO: NOW });
  ok(opt.event.status === 'opted_out' && opt.deactivateRule === true, 'Patient opt-out -> event closed, rule deactivation flagged');
}

// [21-22] Doctor cancel frees booking; reschedule confirmed -> back to awaiting_patient
{
  const p = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const conf = applyPatientResponse({ event: p, response: 'confirm', rule, calendar: emptyCal(), nowISO: NOW });
  const cxl = doctorCancel({ event: conf.event, calendar: conf.calendar, nowISO: NOW });
  ok(cxl.event.status === 'cancelled' && cxl.calendar.bookings.length === 0, 'Doctor cancel -> cancelled + booking removed');
  const resc = doctorReschedule({ event: conf.event, calendar: conf.calendar, targetDateStr: '2026-10-29', nowISO: NOW });
  ok(resc.event.status === 'awaiting_patient' && resc.event.proposedSlotStart.startsWith('2026-10-29') && resc.calendar.bookings.length === 0, 'Doctor reschedule confirmed event -> awaiting_patient, old booking freed');
}

// [23] Doctor override outside window allowed but recorded
{
  const p = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const resc = doctorReschedule({ event: p, calendar: emptyCal(), targetDateStr: '2026-11-05', nowISO: NOW });
  ok(resc.event.status === 'awaiting_patient' && /OUTSIDE requested window/.test(resc.event.history[resc.event.history.length - 1].detail), 'Doctor may override outside window; history records the override');
}

// [24] Guard: closed events reject patient responses
{
  const p = proposeEvent({ rule, anchorDateStr: '2026-10-20', calendar: emptyCal(), existingEvents: [], nowISO: NOW }).event;
  const cxl = doctorCancel({ event: p, calendar: emptyCal(), nowISO: NOW });
  const guard = applyPatientResponse({ event: cxl.event, response: 'confirm', rule, calendar: cxl.calendar, nowISO: NOW });
  ok(!!guard.error, 'Closed events reject patient responses (no zombie bookings)');
}

// [25] todayInTz format
ok(/^\d{4}-\d{2}-\d{2}$/.test(todayInTz('Asia/Calcutta')), 'todayInTz returns YYYY-MM-DD in doctor timezone');

console.log(`\n🎉 ALL ${passed} FOLLOW-UP BOOKING TESTS PASSED!`);
