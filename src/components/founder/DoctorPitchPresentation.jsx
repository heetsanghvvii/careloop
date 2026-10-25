import React, { useState } from 'react';
import { WhatsAppBotEngine } from '../../../server/whatsappBotEngine.js';

export const DoctorPitchPresentation = ({ pitchData, onClose, onOpenClinicWorkspace }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [simText, setSimText] = useState('DONE');
  const [simOutput, setSimOutput] = useState(null);
  const [copiedMemo, setCopiedMemo] = useState(false);

  const botEngine = new WhatsAppBotEngine();

  const doctorName = pitchData?.doctorName || 'Dr. Sneha Kulkarni';
  const clinicName = pitchData?.clinicName || "Dr. Sneha's Metabolic Health & PCOS Clinic";
  const specialty = pitchData?.specialty || 'Metabolic Health & PCOS Dietetics';
  const city = pitchData?.city || 'Indiranagar, Bengaluru';
  const patientVolume = pitchData?.patientVolume || '50-100';
  const painPoint = pitchData?.painPoint || 'Patients forget dietary instructions within 3 days of consultation';

  // Computed intelligence insights based on specialty
  const specialtyInsights = {
    'Metabolic Health & PCOS Dietetics': {
      dropoffStat: 'could structured daily check-ins help PCOS patients follow a doctor-authored dietary plan between visits?',
      rootCause: 'Complex seed cycling, spearmint tea timing, and low-GI meal planning feel overwhelming at home alone.',
      solutionProtocol: 'PCOS & Insulin Resistance 21-Day Daily Habit Protocol',
      sampleTasks: [
        { title: 'Morning Fenugreek/Spearmint Anchor', detail: '300ml lukewarm infused water before caffeine' },
        { title: '30g Protein Breakfast Plate', detail: 'Fiber-first breakfast to blunt morning glucose spikes' },
        { title: '15-min Post-Lunch NEAT Walk', detail: 'Gentle insulin-sensitizing outdoor movement' },
        { title: 'Evening Magnesium & Wind-Down Log', detail: 'Target 7+ hours restorative sleep' }
      ],
      monthlyRevenueUnlock: '₹75,000 - ₹1,20,000 / month (assumption for discussion, not a forecast)'
    },
    'Diabetes & Glycemic Management': {
      dropoffStat: 'could daily check-ins help Type 2 diabetics follow a doctor-authored evening routine between visits?',
      rootCause: 'Patients lack real-time accountability between quarterly HbA1c blood tests.',
      solutionProtocol: '30-Day Indian Diabetes & Glycemic Reset',
      sampleTasks: [
        { title: 'Pre-Meal Fiber Preload', detail: 'Raw cucumber/salad 10 mins before carbohydrates' },
        { title: 'Post-Prandial 1,500 Steps', detail: 'Brisk walk within 30 mins of heaviest meal' },
        { title: 'Daily Fasting Sugar Log', detail: 'Quick one-tap entry for physician review' },
        { title: 'Evening Carb-Cutoff Rule', detail: 'No refined carbs within 3 hours of sleep' }
      ],
      monthlyRevenueUnlock: '₹90,000 - ₹1,50,000 / month (assumption for discussion, not a forecast)'
    },
    'Sports Physiotherapy & Orthopedic Rehab': {
      dropoffStat: 'could daily check-ins help rehabilitation clients keep up a doctor-prescribed home-exercise plan?',
      rootCause: 'Home exercise sheets get lost; clients worry mild soreness might be reinjury.',
      solutionProtocol: 'Lumbar Spine & Core Functional Rehabilitation',
      sampleTasks: [
        { title: 'McGill Big 3 Stabilization', detail: 'Curl-up, side bridge, and bird-dog sequence' },
        { title: 'Glute Activation Sequence', detail: 'Banded bridges with slow 3-sec eccentric lower' },
        { title: 'Desk Ergonomics Micro-Break', detail: 'Standing lumbar extension every 45 mins' },
        { title: 'Evening Discomfort Scale (0-10)', detail: 'Direct flag if pain score exceeds threshold' }
      ],
      monthlyRevenueUnlock: '₹60,000 - ₹1,10,000 / month (assumption for discussion, not a forecast)'
    },
    'Preventive Cardiology & Hypertension': {
      dropoffStat: 'could daily check-ins help hypertensive patients follow a doctor-authored sodium and stress plan?',
      rootCause: 'Lack of daily micro-habits to counteract sedentary work routines.',
      solutionProtocol: 'Cardiometabolic 28-Day Habit Architecture',
      sampleTasks: [
        { title: 'Morning 20-min Zone 2 Walk', detail: 'Natural sunlight and steady nasal breathing' },
        { title: 'DASH Sodium Pre-Check', detail: 'Low-sodium home-cooked meal verification' },
        { title: '4-7-8 Breathwork Protocol', detail: '8 mins parasympathetic tone regulation' },
        { title: 'Resting Blood Pressure Entry', detail: 'Weekly trending graph for physician' }
      ],
      monthlyRevenueUnlock: '₹70,000 - ₹1,30,000 / month (assumption for discussion, not a forecast)'
    }
  };

  const currentInsight = specialtyInsights[specialty] || specialtyInsights['Metabolic Health & PCOS Dietetics'];

  // Total slides
  const totalSlides = 7;

  const handleSimulate = async () => {
    try {
      const res = await botEngine.processIncomingMessage({
        entry: [{
          changes: [{
            value: {
              contacts: [{ profile: { name: 'Ananya Rao' } }],
              messages: [{
                from: '919876511223',
                id: 'wamid.pitch_sim_' + Date.now(),
                type: 'text',
                text: { body: simText }
              }]
            }
          }]
        }]
      }, {
        participant: {
          name: 'Ananya Rao',
          phone: '+91 98765 11223',
          currentDay: 3,
          totalDays: 21,
          streakDays: 2,
          programTitle: currentInsight.solutionProtocol
        },
        simulateOnly: true
      });
      setSimOutput(res);
    } catch (e) {
      setSimOutput({ status: 'error', error: e.message });
    }
  };

  const generateWhatsAppPitchMessage = () => {
    const text = 
`Hello ${doctorName},

I hope you're having a productive week at ${clinicName}.

We built Careloop specifically to solve the patient follow-through gap between consultations in ${specialty}.

The open question we are exploring with clinics: ${currentInsight.dropoffStat}

Careloop gives your practice a 100% WhatsApp-native check-in loop:
1. You assign your custom ${currentInsight.solutionProtocol} via a printable clinic QR stand at your desk.
2. Your patients check in daily on WhatsApp (e.g. replying "Done" or "Help") without downloading any new app.
3. Your dashboard alerts you immediately if a patient drops off for 3 consecutive days.

We prepared a personalized interactive pilot deck for ${clinicName}:
https://sheetsanghvvii.github.io/careloop/

Would you be open to a 10-minute demonstration this week?`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const copyMemoToClipboard = () => {
    const memo = 
`CARELOOP EXECUTIVE CLINICAL MEMO FOR ${doctorName.toUpperCase()}
Clinic: ${clinicName} (${city})
Specialty Focus: ${specialty}
Target Monthly Volume: ${patientVolume} patients

PROBLEM DIAGNOSIS:
• Current Bottleneck: ${painPoint}
• Clinical Follow-Through Hypothesis (unvalidated research question): ${currentInsight.dropoffStat}
• Structural Driver: ${currentInsight.rootCause}

CARELOOP INTERVENTION:
• Protocol: ${currentInsight.solutionProtocol}
• Check-in Channel: WhatsApp Native (No App Store barrier)
• Clinical Dashboard: Real-time adherence scores, red-flag triage, and clinic QR stand

PRACTICE IMPACT ASSUMPTIONS (NOT FORECASTS):
• Revenue Assumption for Discussion (input assumption, not a forecast; not validated): ${currentInsight.monthlyRevenueUnlock}
• Front-Desk Admin Time: automation of manual WhatsApp replies (time saving varies by clinic)
• Adherence Goal: target 80%+ 30-day program completion (a goal, not a guaranteed outcome)`;

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18231C]/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-y-auto">
      {/* Top Presentation Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10 text-white text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-[#2D6A4F] font-bold tracking-wider text-[11px] uppercase">
            Hyper-Personalized Doctor Pitch
          </span>
          <span className="text-gray-300 hidden sm:inline">
            Target: <strong>{doctorName}</strong> ({clinicName})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-mono text-xs">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="max-w-5xl w-full mx-auto my-auto py-6">
        <div className="bg-[#FFFFFF] text-[#18231C] rounded-3xl shadow-2xl border border-[#E8EAE7] p-6 sm:p-12 min-h-[520px] flex flex-col justify-between">
          
          {/* SLIDE 0: COVER */}
          {currentSlide === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                Confidential Clinical Onboarding Proposal · Careloop
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18231C] leading-tight">
                  Eliminating Patient Drop-Off for <br />
                  <span className="text-[#2D6A4F] underline decoration-wavy decoration-[#52B788]/40">
                    {doctorName}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-2xl">
                  A frictionless, WhatsApp-native adherence loop designed specifically for the clinical workflow at <strong>{clinicName}</strong> ({city}).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F0F2EF]">
                <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7]">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Specialty Focus</div>
                  <div className="text-sm font-bold text-[#18231C] mt-1">{specialty}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7]">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Primary Challenge</div>
                  <div className="text-sm font-bold text-[#18231C] mt-1 truncate" title={painPoint}>{painPoint}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7]">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Estimated Impact</div>
                  <div className="text-sm font-bold text-[#2D6A4F] mt-1">+40% Cohort Adherence</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: THE CLINICAL PROBLEM */}
          {currentSlide === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                The Patient Drop-Off Reality
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18231C]">
                Why {specialty} Patients Stop Following Advice After 72 Hours
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">The Follow-Through Question</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-950">
                    {currentInsight.dropoffStat}
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Patients leave {clinicName} inspired, but real life interrupts: busy work schedules, confusion about meal timing, and zero daily touchpoints between visits.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Root Cause at Home</div>
                  <p className="text-sm font-semibold text-[#18231C]">
                    "{currentInsight.rootCause}"
                  </p>
                  <ul className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-200">
                    <li>❌ Diet charts taped to refrigerators are quickly forgotten.</li>
                    <li>❌ Patients hesitate to call your clinic for minor questions.</li>
                    <li>❌ When a client skips 3 days, shame prevents them from returning.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: HOW CARELOOP WORKS FOR THE DOCTOR */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                The Careloop Architecture
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18231C]">
                Turn Health Advice into Daily Action — Without an App
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] flex flex-col justify-between">
                  <div>
                    <span className="w-7 h-7 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs mb-3">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-[#18231C]">Doctor Prescribes in 60s</h3>
                    <p className="text-xs text-gray-600 mt-2">
                      Hand the patient a custom prescription card with your clinic QR stand, or enroll them with 1 click during OPD.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-semibold text-[#2D6A4F]">
                    ✓ Zero app download needed
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] flex flex-col justify-between">
                  <div>
                    <span className="w-7 h-7 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs mb-3">
                      2
                    </span>
                    <h3 className="font-bold text-sm text-[#18231C]">Patient Checks In on WhatsApp</h3>
                    <p className="text-xs text-gray-600 mt-2">
                      Patient receives structured daily action anchors and replies simply with "Done", "Skip", or "Help".
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-semibold text-[#2D6A4F]">
                    ✓ 98% open rates in India
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] flex flex-col justify-between">
                  <div>
                    <span className="w-7 h-7 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs mb-3">
                      3
                    </span>
                    <h3 className="font-bold text-sm text-[#18231C]">Automated Triage & Alerts</h3>
                    <p className="text-xs text-gray-600 mt-2">
                      Your dashboard highlights exactly who is staying consistent and flags clients who skip 3+ days before they cancel their next appointment.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] font-semibold text-[#2D6A4F]">
                    ✓ Intervene before dropout
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: CUSTOM PROTOCOL PREVIEW */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                Tailored Clinical Protocol
              </span>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18231C]">
                  Protocol Built for {doctorName}'s Patients:
                </h2>
                <p className="text-sm text-[#2D6A4F] font-bold mt-1">
                  {currentInsight.solutionProtocol}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentInsight.sampleTasks.map((task, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E8EAE7] bg-[#FAFAF8] flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#18231C]">{task.title}</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">{task.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F6F3] border border-[#DFE2DC] text-[11px] text-[#5C6E63] flex items-center justify-between">
                <span>⚡ You have 100% control to edit, swap, or delete any task to match your clinical guidelines.</span>
                <span className="font-semibold text-[#2D6A4F]">Fully Configurable</span>
              </div>
            </div>
          )}

          {/* SLIDE 4: CLINIC REVENUE & RETENTION ECONOMICS */}
          {currentSlide === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                Practice Economics & ROI
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18231C]">
                Financial Impact for {clinicName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] text-center">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Cohort Capacity</div>
                  <div className="text-3xl font-extrabold text-[#18231C] mt-2">{patientVolume}</div>
                  <p className="text-[11px] text-gray-500 mt-1">Active patients per cohort</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#EBF7EE] border border-[#BDE8C6] text-center">
                  <div className="text-xs font-semibold text-[#2D6A4F] uppercase">Revenue Retention</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] mt-2">
                    {currentInsight.monthlyRevenueUnlock.split(' ')[0]}
                  </div>
                  <p className="text-[11px] text-[#2D6A4F] mt-1">Monthly practice value unlock</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] text-center">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Staff Time Saved</div>
                  <div className="text-3xl font-extrabold text-[#18231C] mt-2">2+ hrs / day</div>
                  <p className="text-[11px] text-gray-500 mt-1">Replaced manual WhatsApp logs</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                <strong>Why Doctors Partner With Careloop:</strong> When patients hit 80%+ adherence, clinical outcomes become visible. Visible outcomes lead to direct word-of-mouth patient referrals and higher 30-day renewal rates.
              </div>
            </div>
          )}

          {/* SLIDE 5: INTERACTIVE WHATSAPP SIMULATOR */}
          {currentSlide === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                Live Interactive Demonstration
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18231C]">
                Try the WhatsApp Patient Experience Right Now
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Imagine your patient, <strong>Ananya Rao</strong>, has just finished today's action plan. Type a message or click a button to test the bot:
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={simText}
                      onChange={(e) => setSimText(e.target.value)}
                      placeholder="Try DONE, SKIP, or HELP..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#2D6A4F]"
                    />
                    <button
                      onClick={handleSimulate}
                      className="px-4 py-2 rounded-lg bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors"
                    >
                      Send Check-in
                    </button>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <button onClick={() => { setSimText('DONE'); }} className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-[11px] font-semibold text-gray-700">
                      DONE
                    </button>
                    <button onClick={() => { setSimText('SKIP feeling fatigued'); }} className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-[11px] font-semibold text-gray-700">
                      SKIP
                    </button>
                    <button onClick={() => { setSimText('HELP dizziness after lunch'); }} className="px-2.5 py-1 rounded-md bg-red-100 hover:bg-red-200 text-[11px] font-semibold text-red-700">
                      HELP (Trigger Alert)
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400">
                    * Interactive sandbox prototype. No live WhatsApp message is sent to real phones.
                  </p>
                </div>

                {/* Simulated iPhone Box */}
                <div className="bg-[#18231C] text-white rounded-2xl p-4 font-sans text-xs space-y-3 shadow-inner min-h-[180px] flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-gray-400">
                    <span>Careloop Bot for {clinicName}</span>
                    <span className="text-[#52B788]">Online</span>
                  </div>

                  {simOutput ? (
                    <div className="space-y-2">
                      <div className="self-end bg-[#2D6A4F] text-white p-2.5 rounded-xl rounded-br-none ml-auto max-w-[80%] text-[11px]">
                        {simOutput.incomingText}
                      </div>
                      <div className="self-start bg-white/10 text-gray-200 p-2.5 rounded-xl rounded-bl-none mr-auto max-w-[90%] text-[11px] whitespace-pre-line">
                        {simOutput.replyText}
                      </div>
                      {simOutput.participantUpdate?.flaggedAtRisk && (
                        <div className="p-2 rounded-lg bg-red-900/40 border border-red-500/50 text-[10px] text-red-200">
                          🚨 <strong>Doctor Alert Triggered:</strong> Patient flagged as priority on your dashboard!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 my-auto py-4">
                      Click "Send Check-in" above to see the automated clinical response.
                    </div>
                  )}

                  <div className="text-[10px] text-gray-500 text-center">
                    Simulated Patient: Ananya Rao · Day 3 of 21
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: DIRECT CALL-TO-ACTION & ONBOARDING */}
          {currentSlide === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <span className="px-3 py-1 rounded-full bg-[#EBF7EE] text-[#2D6A4F] text-xs font-bold">
                Pilot Onboarding Next Steps
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18231C]">
                Ready to Pilot Careloop at {clinicName}?
              </h2>

              <p className="text-sm text-gray-600 max-w-xl">
                We set up your custom protocol, print your clinic desk stand QR, and test with your first 10 patients for 14 days — zero financial obligation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href={generateWhatsAppPitchMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-colors flex items-center justify-between group shadow-sm text-decoration-none"
                >
                  <div>
                    <div className="font-bold text-sm">Open WhatsApp Pitch Message →</div>
                    <div className="text-[11px] text-white/80 mt-0.5">Send tailored brief directly to {doctorName}</div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">📱</span>
                </a>

                <button
                  onClick={copyMemoToClipboard}
                  className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] hover:bg-[#F0F2EF] transition-colors text-left flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-[#18231C]">
                      {copiedMemo ? '✓ Copied to Clipboard!' : 'Copy 1-Page Clinical Pitch Memo'}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Paste into email, WhatsApp, or clinic letter</div>
                  </div>
                  <span className="text-xl">📋</span>
                </button>
              </div>

              <div className="pt-4 border-t border-[#F0F2EF] flex items-center justify-between text-xs text-gray-500">
                <span>Careloop Early Access Validation · demo uses free tiers; real pilot costs not established</span>
                <button
                  onClick={onOpenClinicWorkspace}
                  className="font-bold text-[#2D6A4F] hover:underline"
                >
                  Preview Sample Clinic Dashboard →
                </button>
              </div>
            </div>
          )}

          {/* Bottom Slide Controls */}
          <div className="pt-6 border-t border-[#F0F2EF] flex items-center justify-between">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentSlide === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              ← Previous Slide
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-[#2D6A4F]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Go to Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
              disabled={currentSlide === totalSlides - 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentSlide === totalSlides - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'
              }`}
            >
              Next Slide →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
