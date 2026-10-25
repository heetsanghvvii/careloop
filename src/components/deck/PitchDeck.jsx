import React, { useState, useEffect } from 'react';
import { 
  IconChevronRight, 
  IconChevronDown, 
  IconArrowLeft, 
  IconCheckCircle, 
  IconSparkles, 
  IconShield, 
  IconUsers, 
  IconTrendingUp, 
  IconMessageSquare,
  IconFlame,
  IconClock,
  IconApple
} from '../Icons.jsx';

export const PitchDeck = ({ onClose, onLaunchDemo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const slides = [
    // Slide 1: Cover
    {
      id: 'slide-1',
      tag: 'EXECUTIVE OVERVIEW',
      title: 'Careloop',
      subtitle: 'The Patient Adherence SaaS for Dietitians & Doctors',
      headline: 'Turning medical and dietary prescriptions into daily patient follow-through.',
      content: (
        <div className="space-y-6 max-w-2xl">
          <p className="text-base sm:text-lg text-[#5C6E63] leading-relaxed">
            In healthcare and nutrition, <strong>giving advice is easy</strong>. Getting patients to follow through every single day between appointments is where 85% of programs fail.
          </p>
          <div className="p-4 rounded-2xl bg-[#EBF7EE] border border-[#BDE8C6] flex items-center justify-between">
            <span className="text-xs font-bold text-[#1B4332]">
              🌿 The Core Loop: Prescribe Routine → Patient Follows via Web/WhatsApp → Doctor Sees Adherence → Timely Interventions
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs pt-4">
            <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">TARGET AUDIENCE</span>
              <span className="font-bold text-[#18231C] text-sm">Dietitians & Doctors</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">BUSINESS MODEL</span>
              <span className="font-bold text-[#2D6A4F] text-sm">B2B SaaS (₹499 - ₹2,999)</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">GEOGRAPHY</span>
              <span className="font-bold text-[#18231C] text-sm">India First → Global</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'Start strong: "Every dietitian in India has the same frustration: they spend 45 minutes crafting a personalized diet chart, and two weeks later the patient has fallen off. Careloop solves the adherence crisis."'
    },

    // Slide 2: The Problem
    {
      id: 'slide-2',
      tag: 'THE ADHERENCE CRISIS',
      title: 'The "Silent Drop-Off" in Indian Healthcare',
      subtitle: 'Why diet plans fail the moment the patient walks out the clinic door',
      headline: 'Dietitians lose recurring clients not because their diet is bad, but because patient follow-through collapses.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
            <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">01 • Lost in the Noise</span>
            <h4 className="font-bold text-sm text-[#18231C]">PDFs & Chat Chaos</h4>
            <p className="text-gray-500 leading-relaxed">
              Patients receive a PDF or printed chart. By Day 4, it is buried beneath family WhatsApp chats and Instagram memes.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
            <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">02 • The Adherence Blindspot</span>
            <h4 className="font-bold text-sm text-[#18231C]">Doctor Has Zero Visibility</h4>
            <p className="text-gray-500 leading-relaxed">
              The dietitian has no clue if the patient is hydrating, taking their supplements, or skipping salads until the next paid visit (or when the patient ghosts).
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">03 • Manual Follow-Up Hell</span>
            <h4 className="font-bold text-sm text-[#18231C]">WhatsApp DM Fatigue</h4>
            <p className="text-gray-500 leading-relaxed">
              Manually typing "Did you follow your diet today?" to 30 clients every morning consumes 3+ hours of non-billable doctor time.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Point out that dietitians are currently trapped in unorganized WhatsApp chats. They want to be healthcare professionals, not full-time WhatsApp reminder robots.'
    },

    // Slide 3: The Solution
    {
      id: 'slide-3',
      tag: 'THE PLATFORM',
      title: 'Careloop: The Adherence Operating System',
      subtitle: 'A dedicated B2B tool that bridges the gap between appointments',
      headline: 'Doctors prescribe routines. Patients check in with zero friction. Adherence becomes measurable.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-[#2D6A4F]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1B4332]">Doctor & Dietitian Dashboard</span>
              <span className="text-[10px] bg-[#EBF7EE] text-[#2D6A4F] px-2 py-0.5 rounded font-bold">Web Control Room</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Assign custom daily diet & habit sequences in under 60 seconds.</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Real-time adherence scores (% completion across cohort).</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> <strong>Inactivity Risk Alert:</strong> Instantly flags clients inactive for ≥3 days.</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> 1-Click CSV export of all patient compliance records.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#2D6A4F]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1B4332]">Patient Experience</span>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">Zero App Friction</span>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Browser-based mobile checklist (no App Store download required).</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Tap <strong>Complete</strong> or <strong>Skip</strong> in 5 seconds.</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Optional reflection notes (e.g. "Bloating subsided today").</li>
              <li className="flex items-start gap-2"><IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" /> Visual habit streaks that keep motivation high.</li>
            </ul>
          </div>
        </div>
      ),
      speakerNotes: 'Emphasize that the patient does not need to install a heavy app. In India, people resist downloading another 150MB app. A fast mobile web checklist converts dramatically better.'
    },

    // Slide 4: WhatsApp Strategy (Phase 1 vs Phase 2)
    {
      id: 'slide-4',
      tag: 'THE INDIA-FIRST WHATSAPP STRATEGY',
      title: 'From Standalone App to WhatsApp Automation',
      subtitle: 'Meeting Indian patients where they already spend 3+ hours daily',
      headline: 'Phase 1 builds the structured database. Phase 2 brings the conversation to WhatsApp.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
                PHASE 1 (BUILT & LIVE TODAY)
              </span>
              <h4 className="font-bold text-sm text-[#18231C]">Standalone Portal + Click-to-WhatsApp</h4>
              <p className="text-gray-500 leading-relaxed">
                Full doctor dashboard and patient web checklist. Patients can tap "Check in on WhatsApp" to send pre-formatted check-ins straight to their doctor's number with zero setup.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#2D6A4F] shadow-xs space-y-2 ring-1 ring-[#2D6A4F]/20">
              <span className="font-bold text-xs uppercase tracking-wider text-white bg-[#2D6A4F] px-2 py-0.5 rounded">
                PHASE 2 (BACKEND READY)
              </span>
              <h4 className="font-bold text-sm text-[#18231C]">Two-Way WhatsApp Cloud Bot</h4>
              <p className="text-gray-500 leading-relaxed">
                Automated morning prompts. Patient replies "Done", "Skip", or "Help" on WhatsApp. Our backend webhook parses the reply and automatically logs it to the doctor's Careloop dashboard!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6] text-[#1B4332] text-xs">
            💡 <strong>Why this staged approach wins:</strong> We don't get slowed down by Meta Business approvals or messaging fees in Month 1. Dietitians can start with Phase 1 immediately, and upgrade to WhatsApp bot automation as an add-on.
          </div>
        </div>
      ),
      speakerNotes: 'This directly answers the prompt conversation: "Start with standalone app, WhatsApp as Phase 2". The backend is already architected and ready.'
    },

    // Slide 5: Business Model
    {
      id: 'slide-5',
      tag: 'BUSINESS MODEL & MONETIZATION',
      title: 'Predictable B2B SaaS Subscriptions',
      subtitle: 'Paid by the doctor or dietitian. 100% Free for the patient.',
      headline: 'Patients pay the doctor ₹2,000 to ₹10,000 for consultations. The doctor pays Careloop a small monthly software fee.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] flex flex-col justify-between">
            <div>
              <span className="font-bold text-sm text-[#18231C]">Starter Tier</span>
              <div className="text-2xl font-extrabold text-[#18231C] mt-2">₹499 <span className="text-xs font-normal text-gray-500">/mo</span></div>
              <p className="text-gray-500 mt-2">Up to 25 active patients. Perfect for solo dietitians running an independent practice.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 font-semibold text-[#2D6A4F]">
              Cost per patient: ₹20 / month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#2D6A4F] shadow-md flex flex-col justify-between ring-2 ring-[#2D6A4F]/20 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              Core Sweet Spot
            </span>
            <div>
              <span className="font-bold text-sm text-[#18231C]">Growth Tier</span>
              <div className="text-2xl font-extrabold text-[#18231C] mt-2">₹1,499 <span className="text-xs font-normal text-gray-500">/mo</span></div>
              <p className="text-gray-500 mt-2">Up to 100 active patients. For busy clinical nutritionists and online transformation programs.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 font-semibold text-[#2D6A4F]">
              Cost per patient: ₹15 / month
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] flex flex-col justify-between">
            <div>
              <span className="font-bold text-sm text-[#18231C]">Scale Tier</span>
              <div className="text-2xl font-extrabold text-[#18231C] mt-2">₹2,999 <span className="text-xs font-normal text-gray-500">/mo</span></div>
              <p className="text-gray-500 mt-2">Up to 300 active patients. For multi-dietitian clinics, wellness centers, and hospital departments.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 font-semibold text-[#2D6A4F]">
              Cost per patient: ₹10 / month
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'The math for the doctor is irresistible: if a dietitian charges a patient ₹3,000 for a 1-month program, Careloop costs just ₹15-20 per patient. Just 1 retained client pays for the entire year of software.'
    },

    // Slide 6: Market Size (India Opportunity)
    {
      id: 'slide-6',
      tag: 'MARKET OPPORTUNITY',
      title: 'India: The Lifestyle Health Capital',
      subtitle: 'Massive TAM driven by metabolic health, PCOS, diabetes, and gut recovery',
      headline: 'India has over 120,000+ dietitians, nutritionists, and lifestyle health doctors.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">TOTAL PRACTITIONERS</span>
              <span className="text-2xl font-extrabold text-[#18231C]">120K+</span>
              <span className="text-gray-500 block mt-0.5 text-[10px]">Dietitians, Nutritionists, Physios</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">ACTIVE CLIENTS</span>
              <span className="text-2xl font-extrabold text-[#2D6A4F]">15M+</span>
              <span className="text-gray-500 block mt-0.5 text-[10px]">Paying for weight & lifestyle care</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
              <span className="text-gray-400 font-bold block text-[10px]">ANNUAL MARKET SIZE</span>
              <span className="text-2xl font-extrabold text-[#18231C]">₹210 Cr+</span>
              <span className="text-gray-500 block mt-0.5 text-[10px]">SaaS spend potential ($25M+)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7]">
            <h4 className="font-bold text-[#18231C] mb-1">The Early Adopter Cohort:</h4>
            <p className="text-gray-600 leading-relaxed">
              Instagram-first dietitians, independent clinical nutritionists in Tier 1 & Tier 2 cities (Mumbai, Bengaluru, Delhi, Pune, Hyderabad), and doctors running specialized PCOS/Diabetes reversal challenges.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Dietitians in India are aggressively moving online. They use Instagram for client acquisition, but currently have zero software for client delivery and follow-through.'
    },

    // Slide 7: Competitive Moat
    {
      id: 'slide-7',
      tag: 'COMPETITIVE LANDSCAPE',
      title: 'Why Existing Tools Fail',
      subtitle: 'The sweet spot between heavy medical EHRs and generic calorie-trackers',
      headline: 'Dietitians are caught between tools that do too much (clunky EHRs) and tools that do too little (spreadsheets).',
      content: (
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left bg-white rounded-xl border border-[#E8EAE7] overflow-hidden">
            <thead className="bg-[#FAFAF8] text-gray-400 uppercase text-[10px] font-bold border-b border-[#E8EAE7]">
              <tr>
                <th className="p-3">Solution</th>
                <th className="p-3">Daily Adherence</th>
                <th className="p-3">Client Experience</th>
                <th className="p-3">Doctor Follow-Up</th>
                <th className="p-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2EF]">
              <tr>
                <td className="p-3 font-bold text-gray-700">Google Sheets / PDFs</td>
                <td className="p-3 text-rose-600">❌ Zero tracking</td>
                <td className="p-3 text-rose-600">❌ Clunky on mobile</td>
                <td className="p-3 text-rose-600">❌ 100% manual DMs</td>
                <td className="p-3 text-gray-500">Unscalable</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-700">Calorie Apps (MyFitnessPal)</td>
                <td className="p-3 text-amber-600">⚠️ Food logging fatigue</td>
                <td className="p-3 text-amber-600">⚠️ Overwhelming for clients</td>
                <td className="p-3 text-rose-600">❌ Consumer-focused</td>
                <td className="p-3 text-gray-500">High drop-off</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-700">Hospital EHRs (Practo, Kareo)</td>
                <td className="p-3 text-rose-600">❌ No habit tracking</td>
                <td className="p-3 text-rose-600">❌ Appointment booking only</td>
                <td className="p-3 text-rose-600">❌ No daily check-ins</td>
                <td className="p-3 text-gray-500">Built for billing, not habits</td>
              </tr>
              <tr className="bg-[#EBF7EE]/60 font-bold text-[#1B4332]">
                <td className="p-3 font-extrabold text-[#2D6A4F]">Careloop</td>
                <td className="p-3 text-emerald-700">✅ 5-sec checklist & streaks</td>
                <td className="p-3 text-emerald-700">✅ Zero app-download web app</td>
                <td className="p-3 text-emerald-700">✅ Automated risk flags (&gt;3d)</td>
                <td className="p-3 text-[#2D6A4F]">Built for Adherence</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      speakerNotes: 'This matrix is your killer slide. It proves to investors and doctors why Careloop has a clear, defensible position in the market.'
    },

    // Slide 8: Technical Architecture
    {
      id: 'slide-8',
      tag: 'TECHNICAL ARCHITECTURE',
      title: 'Production-Grade, Zero-Billing Foundation',
      subtitle: 'Built on Google Cloud Firebase & Node.js for ₹0 infrastructure cost',
      headline: 'The entire MVP runs within free tier allowances without sacrificing security or scalability.',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
            <span className="font-bold text-[#2D6A4F] block">Frontend</span>
            <span className="text-sm font-extrabold text-[#18231C] mt-1 block">React 19 + Vite 8</span>
            <span className="text-gray-500 text-[10px] mt-1 block">Tailwind v4 responsive UI for mobile & desktop</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
            <span className="font-bold text-[#2D6A4F] block">Database & Auth</span>
            <span className="text-sm font-extrabold text-[#18231C] mt-1 block">Cloud Firestore</span>
            <span className="text-gray-500 text-[10px] mt-1 block">Multi-tenant security rules (`firestore.rules`)</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
            <span className="font-bold text-[#2D6A4F] block">WhatsApp Backend</span>
            <span className="text-sm font-extrabold text-[#18231C] mt-1 block">Node.js Engine</span>
            <span className="text-gray-500 text-[10px] mt-1 block">Meta Webhooks, message triage, command parsing</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E8EAE7]">
            <span className="font-bold text-[#2D6A4F] block">Cost to Run MVP</span>
            <span className="text-sm font-extrabold text-emerald-700 mt-1 block">₹0 / month</span>
            <span className="text-gray-500 text-[10px] mt-1 block">Spark Tier free quota (50k reads, 20k writes/day)</span>
          </div>
        </div>
      ),
      speakerNotes: 'Reassure investors and technical advisors that the architecture is clean, decoupled, and cost-effective. No expensive servers or heavy dependencies.'
    },

    // Slide 9: Roadmap
    {
      id: 'slide-9',
      tag: 'PRODUCT ROADMAP',
      title: 'The 3-Phase Execution Roadmap',
      subtitle: 'From standalone SaaS to automated WhatsApp ecosystem',
      headline: 'Clear, disciplined phases that de-risk execution and validate customer willingness to pay.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-[#2D6A4F] space-y-2">
            <span className="text-[10px] font-bold text-white bg-[#2D6A4F] px-2 py-0.5 rounded">PHASE 1 • COMPLETE</span>
            <h4 className="font-bold text-sm text-[#18231C]">Standalone Portal + Click-to-WhatsApp</h4>
            <p className="text-gray-500 leading-relaxed">
              Practitioner dashboard, patient mobile checklist, 4 templates, adherence analytics, CSV export, and native WhatsApp check-in links.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
            <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">PHASE 2 • MONTHS 2-3</span>
            <h4 className="font-bold text-sm text-[#18231C]">Two-Way WhatsApp Bot + UPI Billing</h4>
            <p className="text-gray-500 leading-relaxed">
              Meta Cloud API webhook live, automated morning nudges, Razorpay recurring subscriptions in Rupees, and customized clinic branding.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] space-y-2">
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">PHASE 3 • MONTHS 4-6</span>
            <h4 className="font-bold text-sm text-[#18231C]">Gemini AI Assistant + Clinic Teams</h4>
            <p className="text-gray-500 leading-relaxed">
              AI synthesis of patient reflection notes into weekly doctor reports, multi-practitioner clinic staff access, and wearable integrations.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Phase 1 is already built and working. Phase 2 unlocks automated scale. Phase 3 provides high-margin AI defensibility.'
    },

    // Slide 10: The Ask & Call to Action
    {
      id: 'slide-10',
      tag: 'NEXT STEPS & PILOT COHORT',
      title: 'Our Next Milestone',
      subtitle: 'Onboarding our first 20 pioneer dietitians and doctors',
      headline: 'We are inviting forward-thinking health practitioners to pilot Careloop with their clients.',
      content: (
        <div className="space-y-6 max-w-xl">
          <p className="text-sm text-[#5C6E63] leading-relaxed">
            We are selecting <strong>20 independent dietitians, nutritionists, and doctors</strong> across India for our private pilot cohort.
          </p>

          <div className="p-5 rounded-2xl bg-[#EBF7EE] border border-[#BDE8C6] space-y-2 text-xs">
            <h4 className="font-bold text-[#1B4332]">What Pilot Practitioners Receive:</h4>
            <ul className="space-y-1.5 text-[#2D6A4F]">
              <li>✓ Lifetime lock-in on early-bird pricing (₹499/mo).</li>
              <li>✓ Free curriculum digitization: We format your diet charts into Careloop routines.</li>
              <li>✓ Direct WhatsApp founder channel for feature requests.</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] shadow-sm"
            >
              Launch Live Product Demo
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-white text-[#18231C] font-semibold text-xs border border-gray-300 hover:bg-gray-50"
            >
              Back to Overview
            </button>
          </div>
        </div>
      ),
      speakerNotes: 'End on an active, confident note: invite the doctor or investor to click the live demo and test the real product right in front of them.'
    }
  ];

  const current = slides[currentSlide];

  // Keyboard arrow navigation
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
        
        {/* Top Deck Control Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E8EAE7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
              CL
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#18231C]">
                Careloop Executive Pitch Deck
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showNotes ? 'bg-[#2D6A4F] text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Close Pitch Deck"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
        </div>

        {/* Slide Body View */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6 max-w-4xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
              {current.tag}
            </span>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight leading-tight">
                {current.title}
              </h2>
              <h3 className="text-sm sm:text-base font-bold text-[#2D6A4F] mt-1">
                {current.subtitle}
              </h3>
            </div>

            <p className="text-sm font-semibold text-[#18231C] border-l-2 border-[#2D6A4F] pl-3 py-0.5">
              {current.headline}
            </p>

            {/* Slide Custom Content Component */}
            <div className="pt-2">
              {current.content}
            </div>
          </div>

          {/* Speaker Notes Overlay Drawer */}
          {showNotes && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
              <span className="font-bold block mb-0.5">🎙️ Founder Speaker Notes:</span>
              <p>{current.speakerNotes}</p>
            </div>
          )}
        </div>

        {/* Bottom Slide Navigator Bar */}
        <div className="bg-white px-6 py-4 border-t border-[#E8EAE7] flex items-center justify-between shrink-0 text-xs">
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
              className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              ← Previous
            </button>
            <span className="font-mono text-gray-400 font-medium text-[11px]">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="px-4 py-1.5 rounded-lg bg-[#2D6A4F] text-white font-semibold hover:bg-[#1B4332] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
