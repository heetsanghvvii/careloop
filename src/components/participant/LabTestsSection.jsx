import React, { useCallback, useEffect, useState } from 'react';
import { VialBanner } from '../vial/VialBanner.jsx';
import { ReportTable } from '../vial/ReportTable.jsx';
import {
  getVialService, errMsg, PLACEHOLDER_CONSENT, CONSENT_DRAFT_NOTE
} from '../vial/vialService.js';

const iso = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().split('T')[0]; };

const BookingForm = ({ order, actor, svc, onDone }) => {
  const [pincode, setPincode] = useState('');
  const [check, setCheck] = useState(null);
  const [date, setDate] = useState(iso(1));
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const checkPin = async () => {
    setError(''); setSlotId('');
    const r = await svc.checkServiceability(pincode.trim());
    setCheck(r);
    setSlots(r.serviceable ? await svc.getSlots(pincode.trim(), date) : []);
  };
  const changeDate = async (d) => {
    setDate(d); setSlotId('');
    if (check?.serviceable) setSlots(await svc.getSlots(pincode.trim(), d));
  };
  const book = async () => {
    setBusy(true); setError('');
    try {
      await svc.bookOrder({ actor, orderId: order.id, slot: { slotId, date }, pincode: pincode.trim(), consent: { given: consent } });
      onDone();
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="mt-3 space-y-3">
      <div>
        <label htmlFor={`pin-${order.id}`} className="block text-xs font-bold text-[#5C6E63] mb-1">Pincode</label>
        <div className="flex gap-2">
          <input id={`pin-${order.id}`} inputMode="numeric" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm" placeholder="6 digits" />
          <button onClick={checkPin} disabled={pincode.length !== 6} className="px-3 py-2 rounded-xl border border-[#D8DDD9] text-xs font-bold text-[#1B4332] disabled:opacity-50">Check</button>
        </div>
        {check && (
          <div className={`text-xs mt-1 font-semibold ${check.serviceable ? 'text-emerald-800' : 'text-red-800'}`}>
            {check.serviceable ? `Home collection available in ${check.city}.` : 'Home collection is not available for this pincode.'}
          </div>
        )}
      </div>

      {check?.serviceable && (
        <>
          <div>
            <label htmlFor={`date-${order.id}`} className="block text-xs font-bold text-[#5C6E63] mb-1">Date</label>
            <select id={`date-${order.id}`} value={date} onChange={e => changeDate(e.target.value)} className="w-full rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm bg-white">
              {[1, 2, 3].map(o => <option key={o} value={iso(o)}>{iso(o)}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="text-xs font-bold text-[#5C6E63] mb-1">Collection slot</legend>
            <div className="grid grid-cols-1 gap-2">
              {slots.map(s => (
                <label key={s.slotId} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer ${slotId === s.slotId ? 'border-[#2D6A4F] bg-[#F4FAF6]' : 'border-[#E8EAE7]'}`}>
                  <input type="radio" name={`slot-${order.id}`} checked={slotId === s.slotId} onChange={() => setSlotId(s.slotId)} className="accent-[#2D6A4F]" />
                  {s.start} to {s.end}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="rounded-xl bg-[#F4F6F3] p-3">
            <div className="text-xs text-[#18231C] leading-relaxed">{PLACEHOLDER_CONSENT}</div>
            <div className="text-[11px] font-bold text-amber-800 mt-1">{CONSENT_DRAFT_NOTE}</div>
            <label className="flex items-start gap-2 mt-2 text-xs font-semibold text-[#18231C] cursor-pointer">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#2D6A4F]" />
              I agree to the consent text above
            </label>
          </div>
          <button onClick={book} disabled={busy || !slotId || !consent} className="w-full px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold disabled:opacity-50">Book home collection</button>
        </>
      )}
      {error && <div role="alert" className="text-xs font-semibold text-red-800">{error}</div>}
    </div>
  );
};

export const LabTestsSection = ({ participant }) => {
  const svc = getVialService();
  const actor = { role: 'patient', uid: participant.id, workspaceId: participant.workspaceId || 'ws_demo_001', participantId: participant.id };
  const [orders, setOrders] = useState([]);
  const [bookingId, setBookingId] = useState(null);

  const refresh = useCallback(async () => {
    try { setOrders(await svc.listPatientOrders({ actor })); } catch { setOrders([]); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participant.id]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2000);
    return () => clearInterval(t);
  }, [refresh]);

  return (
    <section aria-label="Lab tests" className="bg-white rounded-2xl border border-[#E8EAE7] p-5 space-y-3">
      <h2 className="text-sm font-extrabold text-[#18231C]">Lab tests</h2>
      <VialBanner />
      {orders.length === 0 && <div className="text-xs text-gray-400 text-center py-4">No lab tests ordered by your doctor.</div>}
      {orders.map(o => (
        <div key={o.id} className="rounded-xl border border-[#E8EAE7] p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#18231C] break-words">{o.tests.map(t => t.name).join(', ')}</div>
              {o.dueDate && <div className="text-xs text-[#5C6E63]">Due {o.dueDate}</div>}
              {o.doctorNote && <div className="text-xs text-[#5C6E63] mt-1">Doctor's note: {o.doctorNote}</div>}
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#F4F6F3] text-[10px] font-bold text-[#1B4332]">{o.statusLabel}</span>
          </div>

          {o.status === 'ordered' && bookingId !== o.id && (
            <button onClick={() => setBookingId(o.id)} className="mt-3 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold">Book home collection</button>
          )}
          {o.status === 'ordered' && bookingId === o.id && (
            <BookingForm order={o} actor={actor} svc={svc} onDone={() => { setBookingId(null); refresh(); }} />
          )}
          {o.booking && (
            <div className="text-xs text-[#5C6E63] mt-2">
              Home collection {o.booking.slot.date}, {o.booking.slot.start} to {o.booking.slot.end}, pincode {o.booking.pincode}
            </div>
          )}
          {o.status === 'reported' && (
            <div className="text-xs text-[#5C6E63] mt-2">Your doctor is reviewing the report. You will see it here once it is released.</div>
          )}
          {o.status === 'released' && o.results && (
            <div className="mt-3">
              {o.releaseNote && <div className="text-xs text-[#18231C] mb-2">Doctor's note: {o.releaseNote}</div>}
              <ReportTable results={o.results} />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
