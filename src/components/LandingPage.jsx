import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  IconCheckCircle, 
  IconSparkles, 
  IconShield, 
  IconActivity, 
  IconUsers, 
  IconClipboardList, 
  IconBarChart, 
  IconBell, 
  IconChevronRight,
  IconDumbbell,
  IconApple,
  IconHeart
} from './Icons.jsx';

export const LandingPage = ({ onExploreDemo, onOpenFirebaseModal }) => {
  const { signInWithGoogle, signInAsDemoPractitioner } = useAuth();

  const audiences = [
    {
      title: 'Fitness Coaches & Influencers',
      description: 'Run paid 4 to 8-week body transformations and strength challenges with automated accountability.',
      icon: IconDumbbell
    },
    {
      title: 'Dietitians & Nutritionists',
      description: 'Track daily micronutrient, hydration, and mindful eating habits without messy spreadsheet exchanges.',
      icon: IconApple
    },
    {
      title: 'Physiotherapists & Rehab',
      description: 'Prescribe guided joint mobility and spinal rehab sequences. Flag non-adherence before setbacks occur.',
      icon: IconHeart
    },
    {
      title: 'Wellness & Habit Mentors',
      description: 'Architect morning and evening circadian routines with verifiable streaks and daily check-ins.',
      icon: IconSparkles
    }
  ];

  const coreSteps = [
    {
      step: '01',
      title: 'Create a Program',
      desc: 'Use customizable templates or design custom daily task sequences tailored to your coaching protocol.'
    },
    {
      step: '02',
      title: 'Assign Actions',
      desc: 'Enroll participants with a simple invite. Each participant receives an assigned mobile-friendly daily task flow.'
    },
    {
      step: '03',
      title: 'Track Completion',
      desc: 'Participants log completions, skips, and notes in real-time. Missing records are never assumed to be failures.'
    },
    {
      step: '04',
      title: 'Review Progress',
      desc: 'Monitor real-time adherence rates, 7-day adherence trends, and inactive participant risk alerts on your dashboard.'
    },
    {
      step: '05',
      title: 'Follow Up',
      desc: 'Identify at-risk participants and trigger simulated reminder sequences to restore momentum before drop-off.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '₹499',
      period: '/month',
      capacity: 'Up to 25 active participants',
      badge: 'Early Stage',
      popular: false,
      features: [
        'All 4 core program templates',
        'Unlimited program creation',
        'Daily task checklist & notes',
        'Participant risk detection (>3 days)',
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
      features: [
        'Everything in Starter',
        'Up to 100 active participants',
        'Category-specific adherence analytics',
        'Multi-week trend forecasts',
        'Priority community support',
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
      features: [
        'Everything in Growth',
        'Up to 300 active participants',
        'Custom program branding',
        'Extended participant history',
        'Upcoming Team coach permissions',
        'Direct onboarding consultation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E2922]">
      {/* Top Banner */}
      <div className="bg-[#1B4332] text-[#D8F3DC] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#52B788] animate-ping" />
        <span>Careloop MVP Prototype: Live in-browser preview with zero cloud billing requirement.</span>
        <button 
          onClick={onOpenFirebaseModal}
          className="underline text-white font-semibold hover:text-[#52B788] ml-2"
        >
          Firebase Setup
        </button>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="m8.5 12 2.5 2.5 5-5" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#18231C]">Careloop</span>
            <span className="text-xs block text-[#5C6E63] font-medium -mt-1">Better follow-through. Measurable progress.</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDemo}
            className="px-4 py-2 text-xs font-semibold text-[#1B4332] bg-[#EBF7EE] border border-[#BDE8C6] rounded-xl hover:bg-[#D8F3DC] transition-colors"
          >
            Explore Sandbox Demo
          </button>
          <button
            onClick={() => signInWithGoogle()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#1B4332] transition-colors shadow-xs flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold border border-[#D8F3DC] mb-6">
          <IconSparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
          Configurable Health Program SaaS for Coaches & Clinicians
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#18231C] tracking-tight leading-[1.15]">
          Better follow-through.<br />
          <span className="text-[#2D6A4F] font-serif italic">Measurable progress.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#5C6E63] max-w-3xl mx-auto leading-relaxed">
          Careloop gives coaches, dietitians, physiotherapists, and wellness practitioners a unified operating system to assign daily health actions, track verified participant completion, and intervene before drop-off occurs.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-sm hover:bg-[#1B4332] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Explore Interactive Demo
            <IconChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => signInAsDemoPractitioner()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#18231C] font-semibold text-sm border border-[#D5D9D4] hover:bg-[#F4F6F3] transition-colors"
          >
            Launch as Dr. Patel (Demo Founder)
          </button>
        </div>

        <p className="mt-4 text-xs text-[#7B8B80]">
          Zero installation • Instant synthetic dataset preloaded • Free Cloud Tier compliant (₹0)
        </p>

        {/* Live Loop Graphic Card */}
        <div className="mt-16 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8EAE7] shadow-xl text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#F0F2EF]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">The Core Adherence Loop</span>
              <h2 className="text-xl font-bold text-[#18231C] mt-1">From program creation to measurable habit change</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF7EE] text-[#1B4332] border border-[#BDE8C6]">
                4 Active Programs Seeded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {coreSteps.map((s, idx) => (
              <div key={s.step} className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EAECE8] relative">
                <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded-md">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-[#18231C] mt-2.5">{s.title}</h3>
                <p className="text-xs text-[#5C6E63] mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-16 bg-[#F4F6F3] border-y border-[#E8EAE7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">Tailored For Practitioners</span>
            <h2 className="text-3xl font-extrabold text-[#18231C] mt-1.5">Who relies on Careloop?</h2>
            <p className="mt-2 text-sm text-[#5C6E63]">
              Whether running a paid online transformation challenge or managing clinical recovery routines, Careloop standardizes accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((aud, i) => {
              const Icon = aud.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#E8EAE7] shadow-xs hover:border-[#2D6A4F]/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#18231C] mb-2">{aud.title}</h3>
                  <p className="text-xs text-[#5C6E63] leading-relaxed">{aud.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hypothesized Pricing Ladder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">Transparent SaaS Pricing</span>
          <h2 className="text-3xl font-extrabold text-[#18231C] mt-1.5">Predictable tiers for every practice stage</h2>
          <p className="mt-2 text-sm text-[#5C6E63]">
            Validation pricing hypotheses based on active participant enrollment. No per-seat penalties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-3xl p-7 bg-white border transition-all ${
                tier.popular 
                  ? 'border-[#2D6A4F] shadow-xl ring-2 ring-[#2D6A4F]/20 relative' 
                  : 'border-[#E8EAE7] shadow-xs'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {tier.badge}
                </span>
              )}

              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-[#18231C]">{tier.name}</h3>
                {!tier.popular && (
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {tier.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#18231C]">{tier.price}</span>
                <span className="text-xs text-[#5C6E63] font-medium">{tier.period}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#2D6A4F]">{tier.capacity}</p>

              <div className="mt-6 pt-6 border-t border-[#F0F2EF] space-y-3">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#405347]">
                    <IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onExploreDemo}
                className={`mt-8 w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'
                    : 'bg-[#F4F6F3] text-[#18231C] hover:bg-[#EAEDE8]'
                }`}
              >
                Test {tier.name} in Sandbox
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-[#7B8B80]">
          * Note: Live payment gateway and card charges are not active in this prototype. Plan capacity enforcement can be tested directly in the workspace.
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8EAE7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#7B8B80]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#18231C]">Careloop</span>
            <span>— Health Program Management SaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onOpenFirebaseModal} className="hover:text-[#18231C]">Firebase Settings</button>
            <button onClick={onExploreDemo} className="hover:text-[#18231C]">Sandbox Demo</button>
            <span>v1.0.0-mvp</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
