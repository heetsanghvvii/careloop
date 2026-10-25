import React from 'react';
import { 
  IconBell, 
  IconMessageSquare, 
  IconSparkles, 
  IconTrendingUp, 
  IconLock,
  IconShield 
} from '../Icons.jsx';

export const AutomationVision = ({ onExploreDemo }) => {
  const roadmapItems = [
    {
      title: 'Scheduled Reminders & Smart Timing',
      desc: 'Deliver morning action prompts and evening wind-down nudges timed to your participants\' local timezones.',
      badge: 'Interactive Simulation in MVP',
      icon: IconBell
    },
    {
      title: 'Two-Way WhatsApp Follow-Ups',
      desc: 'Send daily checklists and receive "Done" or "Need help" replies directly within WhatsApp without app installation.',
      badge: 'Planned v2 Integration',
      icon: IconMessageSquare
    },
    {
      title: 'Automated Response Triage',
      desc: 'Auto-log participant replies to the dashboard and trigger coach notifications when a participant flags pain or difficulty.',
      badge: 'Planned v2 Integration',
      icon: IconSparkles
    },
    {
      title: 'AI Assistance on Professional Protocols',
      desc: 'Synthesize participant check-in notes into weekly adherence digests, strictly grounded in your own coaching curriculum.',
      badge: 'Future Roadmap',
      icon: IconSparkles
    },
    {
      title: 'Advanced Biometric & Wearable Analytics',
      desc: 'Correlate subjective participant check-in notes with resting heart rate, sleep scores, and daily step milestones.',
      badge: 'Future Roadmap',
      icon: IconTrendingUp
    },
    {
      title: 'White-Label Branding & Custom Domains',
      desc: 'Host your participant portals on your own domain with dedicated logos, brand colors, and email sender signatures.',
      badge: 'Future Roadmap',
      icon: IconShield
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Product Roadmap & Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Start with structure. Add automation when you're ready.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            The foundation of great coaching is clarity. We start by giving you a bulletproof workspace for programs and progress, then introduce automated messaging as your practice grows.
          </p>
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roadmapItems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div 
                key={idx}
                className="bg-[#FAFAF8] p-6 rounded-3xl border border-[#E8EAE7] flex flex-col justify-between hover:border-[#2D6A4F]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#D8F3DC]">
                      {item.badge}
                    </span>
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>

                  <h3 className="text-base font-bold text-[#18231C] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5C6E63] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reminder Simulation Sandbox Callout */}
        <div className="mt-12 max-w-3xl mx-auto p-5 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6E63]">
          <div>
            <span className="font-bold text-[#18231C] block text-sm">
              Try the Reminder Simulator in our Demo
            </span>
            <span>
              Experience how scheduled reminder copies and participant replies function right now in our live sandbox.
            </span>
          </div>

          <button
            onClick={onExploreDemo}
            className="px-4 py-2 rounded-xl bg-white border border-[#D5D9D4] text-[#18231C] font-semibold hover:bg-gray-50 transition-colors shrink-0 shadow-xs"
          >
            Launch Simulator Demo →
          </button>
        </div>

      </div>
    </section>
  );
};
