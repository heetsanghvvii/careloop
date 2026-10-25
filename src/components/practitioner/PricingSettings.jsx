import React, { useState } from 'react';
import { 
  IconCreditCard, 
  IconCheckCircle, 
  IconShield, 
  IconSparkles, 
  IconLock,
  IconUsers,
  IconMessageSquare,
  IconActivity
} from '../Icons.jsx';

export const PricingSettings = ({ workspace, participants, onUpdatePlan }) => {
  const currentPlan = workspace?.plan || 'Starter';
  const [switching, setSwitching] = useState(false);
  const [notice, setNotice] = useState('');

  const activeParticipants = participants.filter(p => p.enrollmentStatus === 'active' && !p.archived);

  const planLimits = {
    Starter: 25,
    Growth: 100,
    Scale: 300
  };

  const currentLimit = planLimits[currentPlan] || 25;
  const usagePercent = Math.min(100, Math.round((activeParticipants.length / currentLimit) * 100));

  const plans = [
    {
      name: 'Starter',
      price: '₹499',
      period: '/month',
      hypothesisNote: 'Pilot pricing hypothesis - under validation',
      limit: 25,
      description: 'Ideal for solo trainers, dietitians, or coaches launching their first structured cohort.',
      features: [
        'Up to 25 active participants',
        'Unlimited custom programs',
        'Check-in & streak tracking',
        'Inactivity risk flags (>3 days)',
        'CSV workspace data export'
      ]
    },
    {
      name: 'Growth',
      price: '₹1,499',
      period: '/month',
      hypothesisNote: 'Pilot pricing hypothesis - under validation',
      limit: 100,
      description: 'For growing transformation practices and multiple simultaneous health challenges.',
      features: [
        'Up to 100 active participants',
        'All Starter features',
        'Category adherence analytics',
        'Multi-cohort progress logs',
        'Priority feature roadmap access'
      ]
    },
    {
      name: 'Scale',
      price: '₹2,999',
      period: '/month',
      hypothesisNote: 'Pilot pricing hypothesis - under validation',
      limit: 300,
      period: '/month',
      limit: 300,
      description: 'For established wellness influencers, clinics, and multi-coach fitness operations.',
      features: [
        'Up to 300 active participants',
        'All Growth features',
        'Extended historical data',
        'Advanced adherence velocity',
        'Direct founder onboarding support'
      ]
    }
  ];

  const futureAddons = [
    {
      title: 'Two-Way WhatsApp Cloud Automation',
      desc: 'Deliver daily habit prompts directly on WhatsApp with webhook response handling.',
      status: 'Coming in v2'
    },
    {
      title: 'Gemini AI Coaching Assistant',
      desc: 'Synthesize participant check-in notes into clinical weekly adherence summaries.',
      status: 'Coming in v2'
    },
    {
      title: 'Advanced Biometric Wearables Sync',
      desc: 'Automatic sync with Apple Health, Whoop, and Google Fit daily steps/sleep.',
      status: 'Roadmap'
    },
    {
      title: 'White-Label Custom Domain & Branding',
      desc: 'Host participant portals on your own custom domain with dedicated logo styling.',
      status: 'Roadmap'
    },
    {
      title: 'Multi-Coach Team Permissions',
      desc: 'Assign multiple staff trainers and dietitians with role-based workspace scopes.',
      status: 'Roadmap'
    },
    {
      title: 'EHR & Clinical Practice Integrations',
      desc: 'Export adherence records into Practice Better, SimplePractice, or FHIR endpoints.',
      status: 'Roadmap'
    }
  ];

  const handleSwitchPlan = async (targetPlan) => {
    setSwitching(true);
    await onUpdatePlan(targetPlan);
    setNotice(`Workspace capacity successfully switched to "${targetPlan}" tier (${planLimits[targetPlan]} active participant cap).`);
    setSwitching(false);
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <h2 className="text-xl font-extrabold text-[#18231C]">
            Plans, Capacity & Future Add-ons
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Test tier capacity limits and explore modular future platform extensions with zero financial billing.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold border border-[#D8F3DC]">
          <IconShield className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>Billing Gateway Disconnected (₹0 Cost Prototype)</span>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium animate-in fade-in">
          {notice}
        </div>
      )}

      {/* Active Capacity Meter Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8EAE7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F2EF]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">Active Participant Capacity</span>
            <h3 className="text-xl font-bold text-[#18231C] mt-0.5">
              Current Plan: <span className="text-[#2D6A4F]">{currentPlan}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#18231C]">
              {activeParticipants.length} <span className="text-sm font-normal text-gray-400">/ {currentLimit} participants</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 90 ? 'bg-rose-500' :
                usagePercent >= 70 ? 'bg-amber-500' : 'bg-[#2D6A4F]'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>{usagePercent}% utilized ({activeParticipants.length} active enrollments)</span>
            <span>{currentLimit - activeParticipants.length} seats available</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[#F8F9F7] rounded-xl text-xs text-gray-600">
          <strong>Enforcement Rule:</strong> An "Active Participant" is defined as any enrolled participant with active status in your workspace. When the cap is reached, enrollment of new participants is safely prevented until you switch or upgrade the tier.
        </div>
      </div>

      {/* Pricing Ladder & 1-Click Sandbox Tier Switcher */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#18231C]">
            Pricing Hypotheses & Tier Demonstration
          </h3>
          <p className="text-xs text-gray-500">
            Switch plans below to instantly test how capacity limits and enrollment validation behave:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = p.name === currentPlan;

            return (
              <div 
                key={p.name}
                className={`rounded-2xl p-6 bg-white border transition-all flex flex-col justify-between ${
                  isCurrent 
                    ? 'border-[#2D6A4F] shadow-lg ring-2 ring-[#2D6A4F]/20 relative' 
                    : 'border-[#E8EAE7] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-bold text-[#18231C]">{p.name}</h4>
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#D8F3DC]">
                        Active Tier
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#18231C]">{p.price}</span>
                    <span className="text-xs text-gray-500">{p.period}</span>
                  </div>
                  <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    {p.hypothesisNote}
                  </div>
                  <div className="text-xs font-semibold text-[#2D6A4F] mt-1">
                    Cap: Up to {p.limit} active participants
                  </div>

                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#F0F2EF] space-y-2">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <IconCheckCircle className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0F2EF]">
                  <button
                    disabled={isCurrent || switching}
                    onClick={() => handleSwitchPlan(p.name)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-xs'
                    }`}
                  >
                    {isCurrent ? 'Current Active Tier' : `Switch to ${p.name} (Simulate)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Add-ons Preview (Disabled / Roadmap) */}
      <div className="pt-6 border-t border-[#E8EAE7]">
        <div className="flex items-center gap-2 mb-1">
          <IconLock className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-[#18231C]">
            Modular Platform Add-Ons (Roadmap Preview)
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-5">
          These modular expansions represent post-MVP revenue streams and are currently shown in preview mode.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureAddons.map((addon, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7] flex flex-col justify-between opacity-85"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded uppercase tracking-wider">
                    {addon.status}
                  </span>
                  <IconLock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <h4 className="text-xs font-bold text-[#18231C]">
                  {addon.title}
                </h4>
                <p className="text-[11px] text-[#5C6E63] mt-1.5 leading-relaxed">
                  {addon.desc}
                </p>
              </div>

              <div className="mt-4 pt-2">
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-xs font-medium cursor-not-allowed"
                >
                  Disabled in MVP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
