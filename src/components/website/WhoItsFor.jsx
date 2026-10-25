import React, { useState } from 'react';
import { 
  IconDumbbell, 
  IconApple, 
  IconHeart, 
  IconSparkles, 
  IconCheckCircle, 
  IconChevronRight 
} from '../Icons.jsx';

export const WhoItsFor = ({ onOpenEarlyAccess }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      id: 'fitness-creators',
      title: 'Fitness & Transformation Creators',
      tagline: 'Run paid 4 to 8-week challenges with automated accountability and public proof of results.',
      icon: IconDumbbell,
      focus: 'High Volume & Community Engagement',
      workflow: [
        'Deploy pre-configured 30-day or 6-week challenge curriculums in seconds.',
        'Turn broadcast announcements into individual daily checklist items.',
        'Track verified participant completion rates and streaks for social proof.',
        'Spot participants who drop off early and intervene before challenge ends.'
      ],
      sampleProgram: '6-Week Strength & Functional Mobility'
    },
    {
      id: 'personal-trainers',
      title: 'Personal Trainers & Online Coaches',
      tagline: 'Organize training splits, monitor recovery habits, and follow up without messy DM exchanges.',
      icon: IconSparkles,
      focus: 'Consistency Between Sessions',
      workflow: [
        'Bridge the 165 hours each week your clients spend outside the gym.',
        'Prescribe daily NEAT step goals, mobility circuits, and hydration targets.',
        'Eliminate manual "Did you do your workout today?" text check-ins.',
        'Review individual historical progress logs ahead of client check-in calls.'
      ],
      sampleProgram: 'Hypertrophy & Mobility Periodization'
    },
    {
      id: 'dietitians-nutritionists',
      title: 'Dietitians & Nutritionists',
      tagline: 'Assign food-related routines, hydration targets, check-ins, and adherence tasks without food-logging fatigue.',
      icon: IconApple,
      focus: 'Sustainable Habit Architecture',
      workflow: [
        'Replace calorie-counting fatigue with actionable daily habit anchors.',
        'Prescribe mindful eating targets, vegetable diversity goals, and fluid markers.',
        'Receive client check-in reflection notes directly in a clean timeline.',
        'Monitor whether clients are adhering to elimination or anti-inflammatory protocols.'
      ],
      sampleProgram: 'Mediterranean Anti-Inflammatory Protocol'
    },
    {
      id: 'rehab-physio',
      title: 'Wellness & Rehabilitation Professionals',
      tagline: 'Manage structured routines, recovery exercises, and progress check-ins within your professional scope.',
      icon: IconHeart,
      focus: 'Pain-Free Recovery Compliance',
      workflow: [
        'Assign practitioner-designed spinal stabilization and joint decompression routines.',
        'Document client-reported discomfort scales and reflection notes.',
        'Receive immediate alerts when an at-risk client skips 3 consecutive days.',
        'Ensure clients follow through with corrective exercises between appointments.'
      ],
      sampleProgram: 'Lumbar Spine & Core Rehabilitation'
    }
  ];

  const current = categories[activeCategory];
  const Icon = current.icon;

  return (
    <section id="who-its-for" className="py-24 bg-white border-t border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Versatile Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            One platform. Different ways to change health habits.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Different specialties, same universal challenge: helping people follow through with what you prescribed.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-10">
          {categories.map((cat, idx) => {
            const CatIcon = cat.icon;
            const isSelected = activeCategory === idx;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(idx)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#EBF7EE] border-[#2D6A4F] shadow-xs ring-1 ring-[#2D6A4F]'
                    : 'bg-[#FAFAF8] border-[#E8EAE7] hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                  isSelected ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#18231C] leading-snug">
                  {cat.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Selected Category Feature Card */}
        <div className="max-w-5xl mx-auto bg-[#FAFAF8] rounded-3xl border border-[#E8EAE7] p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#D8F3DC]">
                  {current.focus}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-[#18231C] leading-tight">
                {current.title}
              </h3>

              <p className="text-sm text-[#5C6E63] leading-relaxed">
                {current.tagline}
              </p>

              <div className="pt-2 space-y-2.5">
                {current.workflow.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#405347]">
                    <IconCheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenEarlyAccess}
                  className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors shadow-xs"
                >
                  Join Early Access for {current.title.split('&')[0]}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-2xl border border-[#E8EAE7] shadow-sm space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Ready-to-Deploy Template:
                </div>
                <div className="p-4 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6]">
                  <div className="text-xs font-bold text-[#1B4332]">
                    {current.sampleProgram}
                  </div>
                  <div className="text-[11px] text-[#2D6A4F] mt-1 font-medium">
                    Pre-populated with daily task sequences, duration, and participant check-in rules.
                  </div>
                </div>
                <div className="text-xs text-[#5C6E63] leading-relaxed">
                  ✓ Configurable for your exact methodology.<br />
                  ✓ Custom frequency, instructions, and target metrics.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
