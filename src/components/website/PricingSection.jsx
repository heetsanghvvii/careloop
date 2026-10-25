import React from 'react';
import { IconCheckCircle, IconLock, IconShield } from '../Icons.jsx';

export const PricingSection = ({ onOpenEarlyAccess, onExploreDemo }) => {
  const tiers = [
    {
      name: 'Starter',
      price: '₹499',
      period: '/month',
      capacity: 'Up to 25 active participants',
      badge: 'Early Stage',
      popular: false,
      desc: 'Ideal for solo trainers, dietitians, or coaches launching their first structured cohort.',
      features: [
        'Up to 25 active participants',
        'All 4 evidence-based templates',
        'Unlimited program creation',
        'Daily task checklist & notes',
        'Risk flag for inactivity (>3 days)',
        'CSV workspace data export',
        'Simulated reminder automation'
      ]
    },
    {
      name: 'Growth',
      price: '₹1,499',
      period: '/month',
      capacity: 'Up to 100 active participants',
      badge: 'Most Popular',
      popular: true,
      desc: 'For growing transformation practices and multiple simultaneous health challenges.',
      features: [
        'Up to 100 active participants',
        'Everything in Starter',
        'Category-specific adherence analytics',
        'Multi-week trend forecasts',
        'Priority onboarding support',
        'Upcoming WhatsApp preview access'
      ]
    },
    {
      name: 'Scale',
      price: '₹2,999',
      period: '/month',
      capacity: 'Up to 300 active participants',
      badge: 'High Volume',
      popular: false,
      desc: 'For established wellness influencers, clinics, and multi-coach fitness operations.',
      features: [
        'Up to 300 active participants',
        'Everything in Growth',
        'Extended participant history',
        'Advanced adherence velocity',
        'Direct founder onboarding call',
        'Early access to Team permissions'
      ]
    }
  ];

  const plannedAddons = [
    { name: 'WhatsApp Cloud Automation', desc: 'Deliver daily habit prompts via WhatsApp API' },
    { name: 'Gemini AI Coaching Assistant', desc: 'Synthesize participant check-in notes' },
    { name: 'Custom Domain & Branding', desc: 'Host client portals on your custom URL' },
    { name: 'Team Access & Staff Coaches', desc: 'Delegate programs across multiple trainers' }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#F4F6F3] border-t border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-white px-3 py-1 rounded-full border border-[#D5D9D4]">
            Pilot pricing hypothesis - under validation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Plans that grow with your program.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Proposed early-access pricing hypotheses designed around active participant enrollment. No per-seat penalties.
          </p>
          <p className="text-xs text-[#7B8B80] italic">
            Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'border-[#2D6A4F] shadow-xl ring-2 ring-[#2D6A4F]/20 relative'
                  : 'border-[#E8EAE7] shadow-xs'
              }`}
            >
              <div>
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {tier.badge}
                  </span>
                )}

                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-bold text-[#18231C]">{tier.name}</h3>
                  {!tier.popular && (
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#18231C]">{tier.price}</span>
                  <span className="text-xs text-[#5C6E63] font-medium">{tier.period}</span>
                </div>
                <div className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  Pilot pricing hypothesis - under validation
                </div>
                <div className="text-xs font-bold text-[#2D6A4F] mt-1.5">
                  {tier.capacity}
                </div>

                <p className="mt-3 text-xs text-[#5C6E63] leading-relaxed">
                  {tier.desc}
                </p>

                <div className="mt-6 pt-6 border-t border-[#F0F2EF] space-y-3">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#405347]">
                      <IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F0F2EF] space-y-2">
                <button
                  onClick={onOpenEarlyAccess}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-colors ${
                    tier.popular
                      ? 'bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-sm'
                      : 'bg-[#EBF7EE] text-[#1B4332] hover:bg-[#D8F3DC]'
                  }`}
                >
                  Reserve {tier.name} Early Access
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Planned Modular Add-Ons Bar */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-[#E8EAE7] p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <IconLock className="w-4 h-4 text-gray-400" />
            <h4 className="text-sm font-bold text-[#18231C]">
              Planned Modular Add-Ons (Roadmap)
            </h4>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Future optional add-ons will be billed as predictable modular upgrades. No unlimited usage promises.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plannedAddons.map((addon, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7] text-xs">
                <span className="font-bold text-[#18231C] block">{addon.name}</span>
                <span className="text-[11px] text-[#5C6E63] mt-1 block leading-relaxed">{addon.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Transparency Disclaimer */}
        <div className="mt-8 text-center text-xs text-[#7B8B80] max-w-2xl mx-auto leading-relaxed">
          * These pricing tiers are early-access validation hypotheses. No credit card is required to register, and live payment processing is not connected during this initial prototype phase.
        </div>

      </div>
    </section>
  );
};
