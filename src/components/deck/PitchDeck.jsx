import React, { useState, useEffect } from 'react';
import { 
  IconCheckCircle, 
  IconSparkles, 
  IconShield, 
  IconUsers, 
  IconTrendingUp, 
  IconMessageSquare,
  IconFlame,
  IconClock,
  IconLock
} from '../Icons.jsx';

export const PitchDeck = ({ onClose, onLaunchDemo }) => {
  const [activeDeck, setActiveDeck] = useState('doctors');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const deckData = {
    doctors: {
      title: 'For Doctors & Dietitians',
      badge: '🏥 Clinical Practice Pitch',
      slides: [
        {
          id: 'doc-1',
          tag: 'EXECUTIVE OVERVIEW',
          title: 'Careloop: The Adherence Platform',
          subtitle: 'Turn dietary and lifestyle advice into daily patient follow-through',
          headline: 'In healthcare and nutrition, prescribing advice is easy. Ensuring patients follow through between visits is where most programs struggle.',
          content: (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F] shadow-xs">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Core Objective</span>
                  <span className="text-base font-extrabold text-[#18231C] mt-1 block">Stop Silent Drop-Off</span>
                  <span className="text-gray-500 text-[11px] mt-1 block">Help clients stay consistent with their daily habits between visits.</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Client Experience</span>
                  <span className="text-base font-extrabold text-[#18231C] mt-1 block">Zero App Download</span>
                  <span className="text-gray-500 text-[11px] mt-1 block">Runs directly in mobile browsers or via Click-to-WhatsApp links.</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Renewal Target</span>
                  <span className="text-base font-extrabold text-[#2D6A4F] mt-1 block">Improved Retention</span>
                  <span className="text-gray-500 text-[11px] mt-1 block">(target, not yet validated: higher program renewals via habit tracking)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7] text-[11px] text-[#5C6E63] italic">
                * Medical Disclaimer: Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
              </div>
            </div>
          ),
          notes: 'Address the primary practitioner pain point: dietitians spend time writing customized diet charts, but without daily accountability, patients drift away.'
        },
        {
          id: 'doc-2',
          tag: 'THE CLINICAL PROBLEM',
          title: 'The Silent Drop-Off in Lifestyle Programs',
          subtitle: 'Why diet charts fail the moment the patient walks out the clinic door',
          headline: 'Dietitians lose recurring clients not because the clinical protocol is poor, but because daily follow-through collapses.',
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">01 • Lost in the Noise</span>
                <h4 className="font-bold text-sm text-[#18231C]">PDFs & Chat Clutter</h4>
                <p className="text-gray-500 leading-relaxed">
                  Diet PDFs get buried under messaging apps, memes, and daily group notifications within 72 hours.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">02 • Zero Visibility</span>
                <h4 className="font-bold text-sm text-[#18231C]">The Adherence Blindspot</h4>
                <p className="text-gray-500 leading-relaxed">
                  Practitioners have no clue if patients are hydrating or following meal routines until the next consultation.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">03 • Manual DM Fatigue</span>
                <h4 className="font-bold text-sm text-[#18231C]">Administrative Overhead</h4>
                <p className="text-gray-500 leading-relaxed">
                  Typing individual follow-up messages drains non-billable hours. (target, not yet validated: potential time saved).
                </p>
              </div>
            </div>
          ),
          notes: 'Emphasize that clinicians want to practice their profession, not spend their mornings typing manual WhatsApp check-ins.'
        },
        {
          id: 'doc-3',
          tag: 'THE SOLUTION',
          title: 'Careloop: The Adherence Operating System',
          subtitle: 'A dedicated workspace bridging the gap between appointments',
          headline: 'Practitioners prescribe structured routines. Patients check in with zero friction. Progress becomes visible.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]/30 space-y-2.5">
                  <span className="font-bold text-xs text-[#1B4332] block">Practitioner Control Room</span>
                  <ul className="space-y-1.5 text-gray-600">
                    <li>✓ Assign custom daily diet & habit sequences in under 60 seconds.</li>
                    <li>✓ Computed cohort adherence rates from logged actions.</li>
                    <li>✓ Inactivity risk flag: identifies participants inactive for ≥3 days.</li>
                    <li>✓ 1-Click CSV export of all participant records.</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]/30 space-y-2.5">
                  <span className="font-bold text-xs text-[#1B4332] block">Participant Mobile Experience</span>
                  <ul className="space-y-1.5 text-gray-600">
                    <li>✓ Fast mobile web checklist (no app store installation required).</li>
                    <li>✓ 5-second check-ins: Mark Complete or Skip without guilt.</li>
                    <li>✓ Reflection notes for meals, energy, and digestion.</li>
                    <li>✓ Habit streaks to maintain daily motivation.</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
              </div>
            </div>
          ),
          notes: 'Walk through how the lightweight mobile portal reduces client resistance compared to heavy 100MB apps.'
        },
        {
          id: 'doc-4',
          tag: 'WHATSAPP ENGAGEMENT',
          title: 'The WhatsApp Strategy: Staged & Safe',
          subtitle: 'Meeting patients where they already communicate',
          headline: 'Phase 1 provides 1-tap Click-to-WhatsApp links. Phase 2 introduces automated webhook bots.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                  <span className="font-bold text-[10px] text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">PHASE 1 (LIVE TODAY)</span>
                  <h4 className="font-bold text-sm text-[#18231C]">Native Click-to-WhatsApp Deep Links</h4>
                  <p className="text-gray-500">
                    Patients tap a button in their mobile portal to send structured check-in reports straight to their doctor's WhatsApp chat with zero setup.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#2D6A4F] space-y-2">
                  <span className="font-bold text-[10px] text-white bg-[#2D6A4F] px-2 py-0.5 rounded">PHASE 2 (ENGINE READY)</span>
                  <h4 className="font-bold text-sm text-[#18231C]">Two-Way WhatsApp Bot</h4>
                  <p className="text-gray-500">
                    Automated keyword parsing (DONE, SKIP, HELP, STATUS). (Current status: simulated demo - live Meta integration not connected).
                  </p>
                </div>
              </div>
              <div className="p-3 bg-[#EBF7EE] rounded-xl border border-[#BDE8C6] text-[#1B4332] text-[11px]">
                💡 <strong>Why Staged Wins:</strong> Doctors can begin piloting today using Phase 1 without waiting for Meta business manager verification.
              </div>
            </div>
          ),
          notes: 'Explain that Phase 1 carries zero third-party messaging costs, keeping the pilot completely free to test.'
        },
        {
          id: 'doc-5',
          tag: 'PRICING HYPOTHESIS',
          title: 'Predictable Monthly Subscription Tiers',
          subtitle: 'Affordable software fee paid by the practitioner. Free for patients.',
          headline: 'Simple tiers designed to scale with your practice size.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Starter Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹499 <span className="text-xs font-normal text-gray-500">/mo</span></div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">Pilot pricing hypothesis - under validation</span>
                  <p className="text-gray-500 mt-2 text-[11px]">Up to 25 active patients. For solo dietitians starting out.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F] shadow-xs">
                  <span className="font-bold text-xs text-[#18231C]">Growth Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹1,499 <span className="text-xs font-normal text-gray-500">/mo</span></div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">Pilot pricing hypothesis - under validation</span>
                  <p className="text-gray-500 mt-2 text-[11px]">Up to 100 active patients. For busy clinical practices.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Scale Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹2,999 <span className="text-xs font-normal text-gray-500">/mo</span></div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">Pilot pricing hypothesis - under validation</span>
                  <p className="text-gray-500 mt-2 text-[11px]">Up to 300 active patients. For clinics and wellness centers.</p>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
              </div>
            </div>
          ),
          notes: 'Explain that the pricing tiers are pilot validation hypotheses to measure practitioner willingness to pay.'
        },
        {
          id: 'doc-6',
          tag: 'PILOT INVITATION',
          title: 'Join the Pioneer Practitioner Cohort',
          subtitle: 'Onboarding 20 forward-thinking dietitians and lifestyle doctors',
          headline: 'Experience how Careloop improves client accountability in your practice.',
          content: (
            <div className="space-y-4 max-w-lg text-xs">
              <p className="text-[#5C6E63] leading-relaxed">
                We are selecting 20 independent clinicians to test Careloop with their active client cohorts.
              </p>
              <div className="p-4 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6] space-y-1.5 text-[#2D6A4F]">
                <div>✓ Free plan digitization: We convert your diet charts into Careloop routines.</div>
                <div>✓ Lifetime grandfathered early-bird subscription rate.</div>
                <div>✓ Direct founder support channel via WhatsApp.</div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onLaunchDemo}
                  className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white font-bold hover:bg-[#1B4332]"
                >
                  Explore Live Demo
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          notes: 'Close with an invitation to test the interactive demo right away.'
        }
      ]
    },

    investors: {
      title: 'For Seed Investors',
      badge: '📈 Institutional Seed Deck',
      slides: [
        {
          id: 'inv-1',
          tag: 'EXECUTIVE THESIS',
          title: 'Careloop: B2B Vertical SaaS for Chronic Care',
          subtitle: 'Building the adherence and habit infrastructure for chronic disease management',
          headline: 'In lifestyle medicine, therapeutic outcomes are won in daily follow-through, not 15-minute consultations.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Practitioner TAM</span>
                  <span className="text-lg font-extrabold text-[#18231C] mt-1 block">₹1,800 Cr+</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">(Illustrative assumption - not validated)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#2D6A4F]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Unit Economics</span>
                  <span className="text-lg font-extrabold text-[#2D6A4F] mt-1 block">6.8x LTV/CAC</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">(Illustrative assumption - not validated)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Retention Profile</span>
                  <span className="text-lg font-extrabold text-[#18231C] mt-1 block">Low Net Churn</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">(Illustrative assumption - not validated)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">MVP Cost</span>
                  <span className="text-lg font-extrabold text-emerald-700 mt-1 block">₹0 / month</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Firebase Spark tier</span>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Disclaimer: All financial projections, TAM figures, and unit economics represent illustrative assumptions - not validated by historical audited data.
              </div>
            </div>
          ),
          notes: 'Position Careloop as a capital-efficient B2B infrastructure play, not a consumer health app.'
        },
        {
          id: 'inv-2',
          tag: 'MARKET OPPORTUNITY',
          title: 'India: The Metabolic Health Capital',
          subtitle: 'Massive addressable base requiring daily dietary and habit adherence',
          headline: 'Rising chronic conditions in India are shifting care from acute treatment to continuous habit management.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Practitioner Universe</span>
                  <span className="text-2xl font-extrabold text-[#18231C] mt-1 block">120K+</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Dietitians & Doctors (Illustrative assumption - not validated)</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Pre-Diabetic & PCOS Base</span>
                  <span className="text-2xl font-extrabold text-[#2D6A4F] mt-1 block">100M+</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Estimated population (Illustrative assumption - not validated)</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">SaaS Market Size</span>
                  <span className="text-2xl font-extrabold text-[#18231C] mt-1 block">₹210 Cr+</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Annual potential (Illustrative assumption - not validated)</span>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed text-[11px]">
                Initial Beachhead: Instagram-first dietitians and independent clinical nutritionists in Tier-1 and Tier-2 Indian cities running structured paid weight loss and hormonal health cohorts.
              </p>
            </div>
          ),
          notes: 'Highlight that lifestyle medicine doctors currently manage hundreds of patients using disorganized WhatsApp groups.'
        },
        {
          id: 'inv-3',
          tag: 'UNIT ECONOMICS & PRICING',
          title: 'High-Margin Subscription Economics',
          subtitle: 'Predictable monthly subscription revenue with low operational churn',
          headline: 'Practitioners pay monthly subscriptions. Clients access portals at zero cost.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Starter Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹499 / mo</div>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Pilot pricing hypothesis - under validation</span>
                  <span className="text-[11px] text-gray-500 mt-2 block">Cap: 25 active clients</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]">
                  <span className="font-bold text-xs text-[#18231C]">Growth Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹1,499 / mo</div>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Pilot pricing hypothesis - under validation</span>
                  <span className="text-[11px] text-gray-500 mt-2 block">Cap: 100 active clients</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Scale Tier</span>
                  <div className="text-xl font-extrabold text-[#18231C] mt-1">₹2,999 / mo</div>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Pilot pricing hypothesis - under validation</span>
                  <span className="text-[11px] text-gray-500 mt-2 block">Cap: 300 active clients</span>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Modeled CAC: ₹3,200 | LTV: ₹21,600 | Payback: ~2.5 months (All numbers are illustrative assumptions - not validated).
              </div>
            </div>
          ),
          notes: 'Explain that practitioner subscriptions provide recurring predictability, while client virality expands platform footprint.'
        },
        {
          id: 'inv-4',
          tag: 'COMPETITIVE POSITIONING',
          title: 'Defensible Vertical Focus',
          subtitle: 'Positioned between medical billing systems and generic consumer apps',
          headline: 'Careloop solves the specific problem of between-appointment follow-through.',
          content: (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left bg-white rounded-xl border border-[#E8EAE7] overflow-hidden">
                <thead className="bg-[#FAFAF8] text-gray-400 uppercase text-[10px] font-bold border-b border-[#E8EAE7]">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Follow-Through</th>
                    <th className="p-2.5">Client Friction</th>
                    <th className="p-2.5">Doctor Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2EF]">
                  <tr>
                    <td className="p-2.5 font-bold text-gray-700">PDFs & Chat</td>
                    <td className="p-2.5 text-rose-600">❌ Lost in noise</td>
                    <td className="p-2.5 text-rose-600">❌ High clutter</td>
                    <td className="p-2.5 text-rose-600">❌ 100% manual</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-gray-700">Calorie Apps</td>
                    <td className="p-2.5 text-amber-600">⚠️ Logging fatigue</td>
                    <td className="p-2.5 text-amber-600">⚠️ Heavy mobile app</td>
                    <td className="p-2.5 text-rose-600">❌ Consumer only</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-gray-700">Hospital EHRs</td>
                    <td className="p-2.5 text-rose-600">❌ No daily habits</td>
                    <td className="p-2.5 text-rose-600">❌ Appointment portal only</td>
                    <td className="p-2.5 text-gray-600">Built for billing</td>
                  </tr>
                  <tr className="bg-[#EBF7EE]/60 font-bold text-[#1B4332]">
                    <td className="p-2.5 font-extrabold text-[#2D6A4F]">Careloop</td>
                    <td className="p-2.5 text-emerald-700">✅ 5-sec checklist</td>
                    <td className="p-2.5 text-emerald-700">✅ Zero-download web app</td>
                    <td className="p-2.5 text-[#2D6A4F]">Built for Adherence</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
          notes: 'This matrix positions Careloop cleanly in the market whitespace.'
        },
        {
          id: 'inv-5',
          tag: 'TECHNICAL SCALABILITY',
          title: 'Architecture & Privacy Governance',
          subtitle: 'Lean infrastructure with modern data protection principles',
          headline: 'Full-stack application engineered for reliability and zero initial capital burn.',
          content: (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-[#2D6A4F] block">Frontend</span>
                  <span className="text-sm font-bold text-[#18231C]">React 19 + Vite 8</span>
                  <span className="text-gray-400 text-[10px] block">Tailwind v4 UI</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-[#2D6A4F] block">Persistence</span>
                  <span className="text-sm font-bold text-[#18231C]">Dual Firestore/Local</span>
                  <span className="text-gray-400 text-[10px] block">Multi-tenant rules</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-[#2D6A4F] block">WhatsApp Bot</span>
                  <span className="text-sm font-bold text-[#18231C]">Port 4000 Engine</span>
                  <span className="text-gray-400 text-[10px] block">simulated demo - live Meta integration not connected</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-[#2D6A4F] block">Infrastructure</span>
                  <span className="text-sm font-bold text-[#18231C]">₹0 / month</span>
                  <span className="text-gray-400 text-[10px] block">Spark Free Tier</span>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#5C6E63]">
                🛡️ <strong>Regulatory Notice:</strong> Platform is designed with Indian data-protection principles in mind; not a compliance guarantee.
              </div>
            </div>
          ),
          notes: 'Demonstrate capital efficiency: working full-stack prototype without server overhead.'
        },
        {
          id: 'inv-6',
          tag: 'THE SEED ASK',
          title: 'Proposed Pre-Seed Round: ₹1.5 Cr ($180K)',
          subtitle: 'Accelerating doctor acquisition and production WhatsApp scale',
          headline: 'Milestone-driven capital allocation focused on clinician onboarding.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]">
                  <span className="font-bold text-xs text-[#2D6A4F]">50% • Go-To-Market</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">Onboard 500 Clinics</div>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">(Illustrative assumption - not validated)</span>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Direct clinician acquisition and partnership pipelines.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">30% • Product & AI</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">WhatsApp & AI Triage</div>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Meta Cloud API scale and weekly AI clinical digests.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">20% • Operations</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">18-Month Runway</div>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Hosting, regulatory validation, and customer success.</p>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Disclaimer: Target round size and budget allocation represent illustrative assumptions - not validated by binding commitments.
              </div>
            </div>
          ),
          notes: 'Conclude with the investment opportunity: high capital efficiency and clear clinical pain point.'
        }
      ]
    },

    team: {
      title: 'For Potential Team',
      badge: '🚀 Team & Talent Pitch',
      slides: [
        {
          id: 'team-1',
          tag: 'CULTURE & MISSION',
          title: 'Join Careloop: Building Adherence Infrastructure',
          subtitle: 'Helping thousands of patients maintain therapeutic lifestyle habits',
          headline: 'We believe therapeutic outcomes are decided in daily habits, not periodic appointments.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#2D6A4F]">
                  <span className="font-bold text-xs text-[#2D6A4F]">Meaningful Mission</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">Turn Advice into Action</div>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Software that directly supports patient adherence in chronic lifestyle disease management.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Engineering Quality</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">Zero Tech Debt</div>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Modern, fast stack (React 19, Tailwind v4, Node.js, Cloud Firestore) with zero unnecessary bloat.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
                  <span className="font-bold text-xs text-[#18231C]">Early Impact</span>
                  <div className="text-base font-bold text-[#18231C] mt-1">High Ownership</div>
                  <p className="text-gray-500 mt-1.5 text-[11px]">Founding engineer and product designer roles with meaningful equity and architectural authority.</p>
                </div>
              </div>
              <div className="p-3 bg-[#F8F9F7] rounded-xl border border-[#E8EAE7] text-[11px] text-[#7B8B80]">
                * Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
              </div>
            </div>
          ),
          notes: 'Inspire potential engineers and product builders: this is an opportunity to build software with genuine clinical impact.'
        },
        {
          id: 'team-2',
          tag: 'TECHNICAL ROADMAP',
          title: 'Our 3-Phase Execution Roadmap',
          subtitle: 'From standalone habit tracker to complete clinical operating system',
          headline: 'Disciplined technical milestones that balance speed, reliability, and security.',
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#2D6A4F] space-y-2">
                <span className="text-[10px] font-bold text-white bg-[#2D6A4F] px-2 py-0.5 rounded">PHASE 1 (COMPLETE)</span>
                <h4 className="font-bold text-sm text-[#18231C]">Core Platform</h4>
                <p className="text-gray-500 text-[11px]">
                  Practitioner workspace, mobile portal, clinical program builder, template library, and Click-to-WhatsApp check-in links.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">PHASE 2 (READY)</span>
                <h4 className="font-bold text-sm text-[#18231C]">Two-Way WhatsApp Bot</h4>
                <p className="text-gray-500 text-[11px]">
                  Meta Cloud API webhooks, automated morning nudges, and response triage. (simulated demo - live Meta integration not connected).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">PHASE 3 (ROADMAP)</span>
                <h4 className="font-bold text-sm text-[#18231C]">AI Clinical Copilot</h4>
                <p className="text-gray-500 text-[11px]">
                  Gemini AI summaries of participant check-in reflections into weekly clinical briefs with automated risk flagging.
                </p>
              </div>
            </div>
          ),
          notes: 'Walk through the staged roadmap: practical delivery today, ambitious AI features tomorrow.'
        },
        {
          id: 'team-3',
          tag: 'ETHICS & PRIVACY',
          title: 'Responsible Health Tech Architecture',
          subtitle: 'Data governance designed with Indian privacy principles in mind',
          headline: 'We build for trust, patient autonomy, and non-punitive accountability.',
          content: (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                  <span className="font-bold text-xs text-[#18231C]">Multi-Tenant Isolation</span>
                  <p className="text-gray-500 text-[11px]">
                    Strict Firestore security rules guarantee that one clinic workspace can never query or read another clinic's records.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                  <span className="font-bold text-xs text-[#18231C]">Data Privacy Governance</span>
                  <p className="text-gray-500 text-[11px]">
                    Platform is designed with Indian data-protection principles in mind; not a compliance guarantee.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-[#EBF7EE] rounded-xl border border-[#BDE8C6] text-[#1B4332] text-[11px]">
                🌿 <strong>Anti-Guilt Philosophy:</strong> Missing a check-in is never treated as a moral failure. Rest days are accommodated seamlessly.
              </div>
            </div>
          ),
          notes: 'Highlight our product philosophy: positive reinforcement, not punitive notifications.'
        },
        {
          id: 'team-4',
          tag: 'JOIN US',
          title: 'Building from Day Zero',
          subtitle: 'Help us scale Careloop across clinics and practices',
          headline: 'Looking for builders passionate about healthcare, usability, and developer craft.',
          content: (
            <div className="space-y-4 max-w-lg text-xs">
              <p className="text-[#5C6E63] leading-relaxed">
                We are building a lean, focused team of engineers and operators based in India.
              </p>
              <div className="p-4 rounded-xl bg-white border border-[#E8EAE7] space-y-2">
                <span className="font-bold text-xs text-[#18231C]">Open Exploratory Roles:</span>
                <ul className="space-y-1 text-gray-600 text-[11px]">
                  <li>• Founding Full-Stack Engineer (React 19 / Node.js / Cloud APIs)</li>
                  <li>• Founding Product Designer (Design Systems / Healthcare UX)</li>
                  <li>• Clinical Success & Doctor Onboarding Lead</li>
                </ul>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onLaunchDemo}
                  className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white font-bold hover:bg-[#1B4332]"
                >
                  Explore Demo Workspace
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          notes: 'Conclude team deck with an open call to collaborate.'
        }
      ]
    }
  };

  const currentDeck = deckData[activeDeck];
  const slides = currentDeck.slides;
  const current = slides[currentSlide] || slides[0];

  const handleSwitchDeck = (deckKey) => {
    setActiveDeck(deckKey);
    setCurrentSlide(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1E17]/60 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Deck Card Container */}
      <div className="bg-[#FBFBFA] rounded-3xl border border-[#D5D9D4] shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden text-left relative">
        
        {/* Top Header with Deck Selector Tabs */}
        <div className="bg-white px-6 py-3.5 border-b border-[#E8EAE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs shrink-0">
              CL
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#18231C]">
                Careloop Pitch Decks
              </span>
              <span className="text-xs text-gray-400 ml-2">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>

          {/* 3 Decks Audience Switcher */}
          <div className="flex items-center bg-[#F4F6F3] p-1 rounded-xl border border-[#E8EAE7] text-xs">
            <button
              onClick={() => handleSwitchDeck('doctors')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeDeck === 'doctors' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏥 Doctors
            </button>
            <button
              onClick={() => handleSwitchDeck('investors')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeDeck === 'investors' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Investors
            </button>
            <button
              onClick={() => handleSwitchDeck('team')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeDeck === 'team' ? 'bg-white text-[#2D6A4F] shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🚀 Team
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showNotes ? 'bg-[#2D6A4F] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {showNotes ? 'Hide Notes' : 'Notes'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Close Pitch Deck"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Slide Body View */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#D8F3DC]">
                {current.tag}
              </span>
              <span className="text-[10px] font-semibold text-gray-500">
                {currentDeck.badge}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18231C] tracking-tight leading-tight">
                {current.title}
              </h2>
              <h3 className="text-sm sm:text-base font-bold text-[#2D6A4F] mt-0.5">
                {current.subtitle}
              </h3>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#18231C] border-l-2 border-[#2D6A4F] pl-3 py-0.5">
              {current.headline}
            </p>

            <div className="pt-2">
              {current.content}
            </div>
          </div>

          {/* Speaker Notes Drawer */}
          {showNotes && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
              <span className="font-bold block mb-0.5">🎙️ Speaker Note:</span>
              <p>{current.notes}</p>
            </div>
          )}
        </div>

        {/* Bottom Slide Navigator Bar */}
        <div className="bg-white px-6 py-3.5 border-t border-[#E8EAE7] flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-[#2D6A4F]' : 'w-2 bg-gray-200 hover:bg-gray-300'
                }`}
                title={`Jump to Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => prev - 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="font-mono text-gray-400 font-medium text-[11px]">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="px-3.5 py-1 rounded-lg bg-[#2D6A4F] text-white font-semibold hover:bg-[#1B4332] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
