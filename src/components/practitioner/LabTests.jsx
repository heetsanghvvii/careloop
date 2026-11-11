import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { VialBanner } from '../vial/VialBanner.jsx';
import { ReportTable } from '../vial/ReportTable.jsx';
import { getVialService, getCatalog, buildDemoEvent, errMsg } from '../vial/vialService.js';

const STATUS_STYLE = {
  ordered: 'bg-gray-100 text-gray-700',
  booked: 'bg-blue-50 text-blue-800',
  collected: 'bg-blue-50 text-blue-800',
  reported: 'bg-amber-100 text-amber-900',
  released: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-100 text-gray-500',
  failed: 'bg-gray-100 text-gray-500'
};
const STATUS_TEXT = {
  ordered: 'Ordered', booked: 'Booked', collected: 'Sample collected',
  reported: 'Report ready, awaiting your review', released: 'Released to patient',
  cancelled: 'Cancelled', failed: 'Collection failed'
};

const card = 'bg-white rounded-2xl border border-[#E8EAE7] shadow-xs p-5';
const btnPrimary = 'px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold disabled:opacity-50';
const btnGhost = 'px-3 py-2 rounded-xl border border-[#D8DDD9] bg-white text-[#1B4332] text-xs font-bold hover:bg-[#F4F6F3] disabled:opacity-50';

export const LabTests = ({ workspace, participants }) => {
  const { currentUser } = useAuth();
  const svc = getVialService();
  const workspaceId = workspace?.id || 'ws_demo_001';
  const actor = { role: 'doctor', uid: currentUser?.uid || 'user_dr_trisha', workspaceId };
  const people = (participants || []).filter(p => !p.archived);
  const nameOf = (id) => (participants || []).find(p => p.id === id)?.name || id;

  const [orders, setOrders] = useState([]);
  const [participantId, setParticipantId] = useState('');
  const [selected, setSelected] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [releaseNote, setReleaseNote] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const list = await svc.listDoctorOrders({ actor });
    list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    setOrders(list);
    if (openId) {
      try { setDetail(await svc.getDoctorView({ actor, orderId: openId })); } catch { setDetail(null); }
    } else setDetail(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, workspaceId, actor.uid]);

  useEffect(() => { refresh(); }, [refresh]);

  const run = async (fn, okText) => {
    setBusy(true);
    try { await fn(); setMsg({ ok: true, text: okText }); }
    catch (e) { setMsg({ ok: false, text: errMsg(e) }); }
    finally { setBusy(false); await refresh(); }
  };

  const toggle = (code) => setSelected(s => (s.includes(code) ? s.filter(c => c !== code) : [...s, code]));

  const create = () => run(async () => {
    const pid = participantId || people[0]?.id;
    const order = await svc.createOrder({
      actor, doctorId: actor.uid, participantId: pid, workspaceId,
      tests: selected, dueDate: dueDate || undefined, doctorNote: note || undefined
    });
    setSelected([]); setDueDate(''); setNote('');
    setOpenId(order.id);
  }, 'Order created. The patient can now book collection.');

  const simulate = (type) => run(async () => {
    await svc.applyProviderEvent(buildDemoEvent(type, detail.order));
  }, 'Demo event applied.');

  const release = () => run(async () => {
    await svc.releaseReport({ actor, orderId: openId, releaseNote: releaseNote || undefined });
    setReleaseNote('');
  }, 'Report released to the patient.');

  const cancel = () => run(async () => {
    await svc.cancelOrder({ actor, orderId: openId, reason: 'Cancelled by doctor' });
  }, 'Order cancelled.');

  const order = detail?.order;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#18231C]">Lab Tests</h1>
        <p className="text-sm text-[#5C6E63] mt-1">You choose the tests. Reports stay hidden from the patient until you release them.</p>
      </div>
      <VialBanner />

      {msg && (
        <div role="status" className={`rounded-xl px-3 py-2 text-xs font-semibold border ${msg.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create order */}
        <section className={card} aria-label="Create lab order">
          <h2 className="text-sm font-extrabold text-[#18231C] mb-4">New lab order</h2>
          <label className="block text-xs font-bold text-[#5C6E63] mb-1" htmlFor="vial-participant">Participant</label>
          <select id="vial-participant" value={participantId || people[0]?.id || ''} onChange={e => setParticipantId(e.target.value)}
            className="w-full rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm bg-white">
            {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <fieldset className="mt-4">
            <legend className="text-xs font-bold text-[#5C6E63] mb-1">Tests</legend>
            <div className="space-y-2">
              {getCatalog().map(t => (
                <label key={t.code} className="flex items-center gap-2 text-sm text-[#18231C] rounded-xl border border-[#E8EAE7] px-3 py-2 cursor-pointer">
                  <input type="checkbox" checked={selected.includes(t.code)} onChange={() => toggle(t.code)} className="w-4 h-4 accent-[#2D6A4F]" />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-bold text-[#5C6E63] mb-1" htmlFor="vial-due">Due date (optional)</label>
              <input id="vial-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="block text-xs font-bold text-[#5C6E63] mt-4 mb-1" htmlFor="vial-note">Note to patient (optional)</label>
          <textarea id="vial-note" value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm" />

          <button onClick={create} disabled={busy || selected.length === 0 || people.length === 0} className={`${btnPrimary} mt-4`}>Create order</button>
        </section>

        {/* Orders list */}
        <section className={card} aria-label="Lab orders">
          <h2 className="text-sm font-extrabold text-[#18231C] mb-4">Orders ({orders.length})</h2>
          {orders.length === 0 && <div className="text-xs text-gray-400 text-center py-8">No lab orders yet.</div>}
          <div className="space-y-2">
            {orders.map(o => (
              <button key={o.id} onClick={() => { setOpenId(o.id); setMsg(null); }}
                className={`w-full text-left rounded-xl border px-3 py-3 ${openId === o.id ? 'border-[#2D6A4F] bg-[#F4FAF6]' : 'border-[#E8EAE7] hover:bg-[#FAFAF8]'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#18231C] truncate">{nameOf(o.participantId)}</div>
                    <div className="text-xs text-[#5C6E63] break-words">{o.tests.map(t => t.name).join(', ')}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[o.status]}`}>{STATUS_TEXT[o.status]}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Order detail */}
      {order && (
        <section className={card} aria-label="Order detail">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-[#18231C]">{nameOf(order.participantId)}: {order.tests.map(t => t.name).join(', ')}</h2>
              <div className="text-xs text-[#5C6E63] mt-1">
                Status: <span className="font-bold">{STATUS_TEXT[order.status]}</span>
                {order.dueDate && <> · Due {order.dueDate}</>}
                {order.booking && <> · Collection {order.booking.slot.date} {order.booking.slot.start} to {order.booking.slot.end}, pincode {order.booking.pincode}</>}
              </div>
              {order.doctorNote && <div className="text-xs text-[#5C6E63] mt-1">Your note: {order.doctorNote}</div>}
            </div>
            {['ordered', 'booked'].includes(order.status) && (
              <button onClick={cancel} disabled={busy} className={btnGhost}>Cancel order</button>
            )}
          </div>

          {detail.results && (
            <div className="mt-4">
              <div className="text-xs font-bold text-[#18231C] mb-2">
                {detail.pendingReview ? 'Report received. The patient cannot see it yet.' : 'Report (visible to the patient)'}
              </div>
              <ReportTable results={detail.results} />
            </div>
          )}

          {detail.pendingReview && (
            <div className="mt-4 rounded-xl bg-[#F4F6F3] p-4">
              <label className="block text-xs font-bold text-[#5C6E63] mb-1" htmlFor="vial-release-note">Release note (optional)</label>
              <textarea id="vial-release-note" value={releaseNote} onChange={e => setReleaseNote(e.target.value)} rows={2}
                className="w-full rounded-xl border border-[#D8DDD9] px-3 py-2 text-sm bg-white" />
              <button onClick={release} disabled={busy} className={`${btnPrimary} mt-3`}>Release to patient</button>
            </div>
          )}

          {order.status === 'released' && order.releaseNote && (
            <div className="mt-3 text-xs text-[#5C6E63]">Release note: {order.releaseNote}</div>
          )}

          {/* Demo simulator */}
          <div className="mt-5 rounded-xl border border-dashed border-amber-400 bg-amber-50/60 p-4">
            <div className="text-xs font-extrabold text-amber-900">Demo: simulate lab</div>
            <div className="text-[11px] text-amber-900 mt-0.5">Fires mock provider events for this order. Not a real lab.</div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => simulate('sample_collected')} disabled={busy || order.status !== 'booked'} className={btnGhost}>Sample collected</button>
              <button onClick={() => simulate('report_ready')} disabled={busy || order.status !== 'collected'} className={btnGhost}>Report ready</button>
              <button onClick={() => simulate('collection_failed')} disabled={busy || order.status !== 'booked'} className={btnGhost}>Collection failed</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
