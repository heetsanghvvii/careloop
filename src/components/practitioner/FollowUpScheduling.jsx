import React, { useEffect, useState } from 'react';
import { dataService } from '../../firebase/dataService.js';
import {
  addDays, formatSlotInTz, proposeEvent, applyPatientResponse, doctorCancel, doctorReschedule, weekdayOfDate
} from '../../data/followUpScheduler.js';

const STATUS_CHIP = {
  awaiting_patient: 'bg-amber-50 text-amber-800 border-amber-300',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  no_slot_available: 'bg-red-50 text-red-700 border-red-300',
  needs_doctor_review: 'bg-red-50 text-red-700 border-red-300',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
  opted_out: 'bg-gray-100 text-gray-500 border-gray-300',
};
const STATUS_LABEL = {
  awaiting_patient: 'Awaiting patient confirmation',
  confirmed: 'Confirmed (synthetic booking)',
  no_slot_available: 'No slot available',
  needs_doctor_review: 'Needs doctor review (outside requested window)',
  cancelled: 'Cancelled by doctor',
  opted_out: 'Patient opted out',
};

export const FollowUpScheduling = ({ participants }) => {
  const [state, setState] = useState(null);
  const [form, setForm] = useState({ participantId: '', intervalDays: 7, durationMin: 20, windowDays: 3 });
  const [notice, setNotice] = useState('');

  const refresh = () => setState(dataService.getFollowUpState());
  useEffect(() => { refresh(); const unsub = dataService.subscribe(refresh); return unsub; }, []);

  if (!state) return null;
  const { rules, events, calendar, today } = state;
  const tz = calendar.timezone;
  const nowISO = () => new Date().toISOString();
  const nameOf = id => participants.find(p => p.id === id)?.name || id;

  const flash = m => { setNotice(m); setTimeout(() => setNotice(''), 4000); };

  const saveRule = async e => {
    e.preventDefault();
    if (!form.participantId) return;
    await dataService.saveFollowUpRule({ participantId: form.participantId, intervalDays: Number(form.intervalDays), durationMin: Number(form.durationMin), windowDays: Number(form.windowDays), active: true });
    flash('Rule saved (synthetic).');
  };

  const triggerRule = async rule => {
    // Demo trigger: behave as if today is the day-(N-1) due date; slot lands tomorrow-ish on day N.
    const anchor = addDays(today, -(rule.intervalDays - 1)); // anchor so that today IS the trigger date
    const { event, created } = proposeEvent({ rule, anchorDateStr: anchor, calendar, existingEvents: events, nowISO: nowISO(), tz });
    if (!created) { flash('Already proposed for this cycle (idempotent - no duplicate).'); return; }
    await dataService.saveFollowUpEvent(event);
    flash(event.status === 'no_slot_available' ? 'Trigger ran: no slot available on the target day.' : `Trigger ran: slot proposed for ${formatSlotInTz(event.proposedSlotStart, tz)}.`);
  };

  const patientAct = async (event, response) => {
    const rule = rules.find(r => r.id === event.ruleId);
    const res = applyPatientResponse({ event, response, rule, calendar, nowISO: nowISO(), tz });
    if (res.error) { flash(res.error); return; }
    await dataService.saveFollowUpEvent(res.event);
    if (res.calendar !== calendar) await dataService.saveDoctorCalendar(res.calendar);
    if (res.deactivateRule && rule) await dataService.saveFollowUpRule({ ...rule, active: false });
    refresh();
  };

  const cancel = async event => {
    const res = doctorCancel({ event, calendar, nowISO: nowISO() });
    await dataService.saveFollowUpEvent(res.event);
    await dataService.saveDoctorCalendar(res.calendar);
    refresh();
  };

  const reschedule = async event => {
    const target = addDays(today, 1);
    const res = doctorReschedule({ event, calendar, targetDateStr: target, nowISO: nowISO(), tz });
    if (res.error) { flash(res.error); return; }
    await dataService.saveFollowUpEvent(res.event);
    await dataService.saveDoctorCalendar(res.calendar);
    refresh();
  };

  const r2i = ev => (rules.find(r => r.id === ev.ruleId)?.intervalDays || 7) - 1;

  // Week grid data: today..today+6, availability blocks + bookings + proposed/confirmed events
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const localDayKey = iso => iso ? new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso)) : '';
  const dayBookings = d => calendar.bookings.filter(b => localDayKey(b.startISO) === d);
  const dayEvents = d => events.filter(ev => localDayKey(ev.status === 'confirmed' ? ev.confirmedSlotStart : ev.proposedSlotStart) === d && !['cancelled', 'opted_out'].includes(ev.status));

  return (
    <div className="mb-8 rounded-2xl border border-[#E8EAE7] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-lg font-extrabold text-[#18231C]">Automatic Follow-Up Booking</h2>
        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-bold text-amber-800 uppercase">Prototype · simulated scheduling · no real calendar writes</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 max-w-3xl">
        When the doctor says "check after N days", the rule triggers on day N-1 and proposes a day-N slot from the doctor's synthetic availability.
        The patient confirms, declines (auto re-proposal) or opts out. Doctor can cancel or reschedule. All data is demo-only.
      </p>
      {notice && <div className="mt-2 text-xs font-semibold text-[#2D6A4F] bg-[#EBF7EE] border border-[#BDE8C6] rounded-lg px-3 py-2">{notice}</div>}

      {/* Rule form */}
      <form onSubmit={saveRule} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-gray-600">Participant
          <select value={form.participantId} onChange={e => setForm({ ...form, participantId: e.target.value })} className="mt-1 block w-56 rounded-lg border border-[#D5D9D4] px-2 py-1.5 text-sm">
            <option value="">Select…</option>
            {participants.filter(p => !p.archived).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-600">Check after (days)
          <input type="number" min="2" max="90" value={form.intervalDays} onChange={e => setForm({ ...form, intervalDays: e.target.value })} className="mt-1 block w-24 rounded-lg border border-[#D5D9D4] px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-semibold text-gray-600">Duration (min)
          <input type="number" min="10" max="120" step="5" value={form.durationMin} onChange={e => setForm({ ...form, durationMin: e.target.value })} className="mt-1 block w-24 rounded-lg border border-[#D5D9D4] px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs font-semibold text-gray-600">Auto-book window (days)
          <input type="number" min="1" max="14" value={form.windowDays} onChange={e => setForm({ ...form, windowDays: e.target.value })} className="mt-1 block w-24 rounded-lg border border-[#D5D9D4] px-2 py-1.5 text-sm" />
        </label>
        <button className="px-3 py-1.5 rounded-lg bg-[#2D6A4F] text-white text-sm font-bold hover:bg-[#245840]">Save rule</button>
      </form>

      {/* Rules */}
      <div className="mt-4 space-y-2">
        {rules.map(r => (
          <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E8EAE7] bg-[#FAFAF8] px-3 py-2 text-sm">
            <span className="font-bold text-[#18231C]">{nameOf(r.participantId)}</span>
            <span className="text-xs text-gray-500">every {r.intervalDays} days · {r.durationMin} min · trigger day {r.intervalDays - 1} → slot day {r.intervalDays} · auto-book window {r.windowDays || 1}d</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>{r.active ? 'ACTIVE' : 'INACTIVE / OPTED OUT'}</span>
            <button onClick={() => triggerRule(r)} disabled={!r.active} className="ml-auto px-2.5 py-1 rounded-lg border border-[#2D6A4F] text-[#2D6A4F] text-xs font-bold disabled:opacity-40">Simulate day-{r.intervalDays - 1} trigger</button>
          </div>
        ))}
        {rules.length === 0 && <div className="text-xs text-gray-400">No follow-up rules yet.</div>}
      </div>

      {/* Events */}
      <div className="mt-4 space-y-2">
        {events.slice().reverse().map(ev => (
          <div key={ev.id} className="rounded-xl border border-[#E8EAE7] px-3 py-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-[#18231C]">{nameOf(ev.participantId)}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CHIP[ev.status]}`}>{STATUS_LABEL[ev.status]}</span>
              {ev.proposedSlotStart && ev.status !== 'confirmed' && <span className="text-xs text-gray-600">Proposed: {formatSlotInTz(ev.proposedSlotStart, ev.timezone)}</span>}
              {ev.status === 'confirmed' && <span className="text-xs text-gray-600">Booked: {formatSlotInTz(ev.confirmedSlotStart, ev.timezone)}</span>}
              <span className="text-[10px] text-gray-400">key {ev.idempotencyKey}</span>
              <span className="ml-auto flex gap-1.5">
                {ev.status === 'awaiting_patient' && (<>
                  <button onClick={() => patientAct(ev, 'confirm')} className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold">Simulate patient: Confirm</button>
                  <button onClick={() => patientAct(ev, 'decline')} className="px-2 py-1 rounded bg-amber-500 text-white text-[11px] font-bold">Decline → next slot</button>
                  <button onClick={() => patientAct(ev, 'optout')} className="px-2 py-1 rounded bg-gray-500 text-white text-[11px] font-bold">Opt out</button>
                </>)}
                {['awaiting_patient', 'confirmed', 'no_slot_available', 'needs_doctor_review'].includes(ev.status) && (<>
                  <button onClick={() => reschedule(ev)} className="px-2 py-1 rounded border border-[#2D6A4F] text-[#2D6A4F] text-[11px] font-bold">Doctor: reschedule</button>
                  <button onClick={() => cancel(ev)} className="px-2 py-1 rounded border border-red-400 text-red-600 text-[11px] font-bold">Doctor: cancel</button>
                </>)}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-gray-500">Anchor {ev.anchorDate} (day 0) · trigger day {r2i(ev)} = {ev.triggerDate} · requested slot day = {ev.requestedSlotDate} · window ends {ev.windowEnd}</div>
            <div className="mt-0.5 text-[10px] text-gray-400">{ev.history[ev.history.length - 1]?.action} · {ev.history.length} event(s) logged</div>
          </div>
        ))}
        {events.length === 0 && <div className="text-xs text-gray-400">No follow-up events yet. Run a trigger above.</div>}
      </div>

      {/* Synthetic week calendar */}
      <div className="mt-5">
        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Doctor calendar (synthetic) · {tz}</div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map(d => (
            <div key={d} className="rounded-lg border border-[#E8EAE7] bg-[#FAFAF8] p-1.5 min-h-[90px]">
              <div className="text-[10px] font-bold text-gray-600">{d.slice(5)} ({'SMTWTFS'[weekdayOfDate(d)]})</div>
              {calendar.availability.some(w => w.weekday === weekdayOfDate(d))
                ? <div className="text-[9px] text-emerald-700">09:00-13:00 · 15:00-19:00</div>
                : <div className="text-[9px] text-gray-400">Closed</div>}
              {dayBookings(d).map(b => <div key={b.id} className="mt-0.5 rounded bg-gray-200 px-1 py-0.5 text-[9px] text-gray-700 truncate" title={b.title}>{b.title}</div>)}
              {dayEvents(d).map(ev => (
                <div key={ev.id} className={`mt-0.5 rounded px-1 py-0.5 text-[9px] font-bold truncate ${ev.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {ev.status === 'confirmed' ? 'Booked' : 'Proposed'}: {nameOf(ev.participantId)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scope card */}
      <div className="mt-5 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7] p-3 text-[11px] text-gray-600 space-y-1">
        <div><strong>Implemented (local, synthetic):</strong> configurable interval & duration, day-(N-1) trigger → day-N slot, doctor-requested auto-booking window (outside it: needs-doctor-review, never auto-booked), availability windows, conflict skip, confirm-time availability re-check (two pending proposals cannot both book one slot), idempotent re-triggers with explicit cycles, patient confirm/decline/opt-out, doctor cancel/reschedule (override outside window is recorded), timezone-correct display.</div>
        <div><strong>Permissions (demo):</strong> doctor-only vs patient-only actions are separated at the UI level for the prototype - this is not enforced authentication/authorization. Production needs real role-based access control.</div>
        <div><strong>Mocked:</strong> the doctor calendar, bookings, and patient replies are simulated in this browser (localStorage). No real calendar, WhatsApp, or notification writes.</div>
        <div><strong>Planned (production):</strong> Google/Outlook calendar API sync, WhatsApp confirmation messages via Meta Cloud API, real reminder dispatch, race-safe locking on shared calendars.</div>
      </div>
    </div>
  );
};
