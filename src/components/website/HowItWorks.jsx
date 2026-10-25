import React, { useState } from 'react';
import { 
  IconClipboardList, 
  IconUsers, 
  IconCheckCircle, 
  IconTrendingUp,
  IconChevronRight
} from '../Icons.jsx';

export const HowItWorks = ({ onExploreDemo }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    {
      id: 'step-create',
      num: '01',
      title: 'Create',
      headline: 'Build a structured program with routines, goals, and daily actions.',
      desc: 'Use customizable templates or design custom sequences tailored to your coaching protocol. Set durations, frequencies, instructions, and target metrics.',
      tag: 'Curriculum Builder',
      icon: IconClipboardList,
      preview: {
        badge: 'Program Definition',
        name: '21-Day Illustrative Habit Plan (Demo)',
        detail: '4 daily anchor actions • 21-day duration • Category: Habits & Wellness'
      }
    },
    {
      id: 'step-assign',
      num: '02',
      title: 'Assign',
      headline: 'Enroll participants and give each person clear instructions.',
      desc: 'Invite clients with their email address. Participants access their assigned daily tasks directly through their browser on mobile or desktop without downloading an app.',
      tag: 'Client Enrollment',
      icon: IconUsers,
      preview: {
        badge: 'Participant Assignment',
        name: 'Sarah Chen (sarah.chen@example.com)',
        detail: 'Starts Day 1 • Mobile Checklist • Personal streak active'
      }
    },
    {
      id: 'step-track',
      num: '03',
      title: 'Track',
      headline: 'Collect task completions, check-ins, and progress records.',
      desc: 'Clients mark tasks as completed or skipped in seconds and log optional reflection notes. Missing data is never assumed to be a failure.',
      tag: 'Daily Follow-Through',
      icon: IconCheckCircle,
      preview: {
        badge: 'Action Logging',
        name: 'Morning Hydration & Sunlight',
        detail: 'Status: Completed (500ml logged) • Note: "Felt alert by 7 AM"'
      }
    },
    {
      id: 'step-improve',
      num: '04',
      title: 'Improve',
      headline: 'Review engagement and identify participants who may need follow-up.',
      desc: 'Monitor cohort adherence trends and spot clients at risk of disengagement before they fall off completely. Intervene early with targeted support.',
      tag: 'Intervention Loop',
      icon: IconTrendingUp,
      preview: {
        badge: 'Cohort Analytics',
        name: 'Risk Detection Rule Active',
        detail: 'Adherence <60% or inactive >3 days flagged on dashboard'
      }
    }
  ];

  const currentStep = steps[activeStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Simple 4-Step Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            A simple loop. A more consistent experience.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Careloop replaces manual follow-up chaos with a clear, repeatable cycle that keeps both practitioner and participant aligned.
          </p>
        </div>

        {/* Interactive Stepper Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {steps.map((s, idx) => {
            const isActive = activeStepIndex === idx;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isActive 
                    ? 'bg-[#EBF7EE] border-[#2D6A4F] shadow-sm ring-1 ring-[#2D6A4F]' 
                    : 'bg-[#FAFAF8] border-[#E8EAE7] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`}>
                    {s.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`} />
                </div>
                <div className="mt-2 text-sm font-bold text-[#18231C]">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Step Showcase Card */}
        <div className="max-w-4xl mx-auto bg-[#FAFAF8] rounded-3xl border border-[#E8EAE7] p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Step Explanation */}
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#D8F3DC]">
                {currentStep.tag}
              </span>

              <h3 className="text-2xl font-extrabold text-[#18231C] leading-snug">
                {currentStep.headline}
              </h3>

              <p className="text-sm text-[#5C6E63] leading-relaxed">
                {currentStep.desc}
              </p>

              <div className="pt-2">
                <button
                  onClick={onExploreDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
                >
                  <span>See {currentStep.title} in the interactive demo</span>
                  <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Step Preview Mockup */}
            <div className="md:col-span-5">
              <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0F2EF] pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
                    {currentStep.preview.badge}
                  </span>
                  <StepIcon className="w-4 h-4 text-[#2D6A4F]" />
                </div>

                <div className="text-xs font-bold text-[#18231C]">
                  {currentStep.preview.name}
                </div>

                <div className="text-[11px] text-[#5C6E63] leading-relaxed bg-[#FAFAF8] p-3 rounded-xl border border-[#F0F2EF]">
                  {currentStep.preview.detail}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
