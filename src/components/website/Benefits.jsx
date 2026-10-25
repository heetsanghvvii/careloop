import React from 'react';
import { 
  IconShield, 
  IconCheckCircle, 
  IconTrendingUp, 
  IconClipboardList,
  IconUsers
} from '../Icons.jsx';

export const Benefits = () => {
  const benefits = [
    {
      title: 'Clarity',
      tagline: 'Know what each participant has been assigned.',
      desc: 'No more ambiguous WhatsApp threads or forgotten instructions. Every client has a single web-based checklist that defines their exact daily actions, frequencies, and target metrics.',
      icon: IconClipboardList
    },
    {
      title: 'Visibility',
      tagline: 'See recorded completions and engagement trends.',
      desc: 'Track cohort adherence rates, active habit streaks, and individual check-in reflection notes in real-time. Identify who is thriving and who is struggling without manual check-in pings.',
      icon: IconTrendingUp
    },
    {
      title: 'Consistency',
      tagline: 'Make routines and check-ins part of a repeatable workflow.',
      desc: 'Turn loose advice into a standardized daily feedback loop. Build consistent client adherence habits that persist through weekends, travel, and schedule disruptions.',
      icon: IconCheckCircle
    },
    {
      title: 'Scalability',
      tagline: 'Manage structured programs without relying on scattered spreadsheets.',
      desc: 'Scale from managing 5 private clients to cohorts of 50 or 100 participants with zero added administrative friction. All records stay organized under one secure workspace.',
      icon: IconUsers
    }
  ];

  return (
    <section className="py-24 bg-[#F4F6F3] border-t border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-white px-3 py-1 rounded-full border border-[#D5D9D4]">
            Measurable Coaching Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Spend less time chasing updates. More time helping people progress.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Careloop standardizes follow-through so your clients stay engaged and your coaching capacity can scale sustainably.
          </p>
        </div>

        {/* 4 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((b) => {
            const Icon = b.icon;

            return (
              <div 
                key={b.title}
                className="bg-white p-7 rounded-3xl border border-[#E8EAE7] shadow-xs flex flex-col justify-between hover:border-[#2D6A4F]/40 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#18231C]">
                    {b.title}
                  </h3>
                  <h4 className="text-xs font-bold text-[#2D6A4F] mt-1 leading-snug">
                    {b.tagline}
                  </h4>
                  <p className="text-xs text-[#5C6E63] mt-3 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
