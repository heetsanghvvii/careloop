import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '../Icons.jsx';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who is Careloop for?',
      a: 'Careloop is built for anyone who professionally guides others toward better health and daily habits. This includes fitness influencers running transformation challenges, online personal trainers, dietitians, nutritionists, physiotherapists, and wellness coaches. While their specialties differ, they all share the same need: ensuring clients actually follow through with prescribed daily actions.'
    },
    {
      q: 'Can fitness creators use Careloop for paid challenges?',
      a: 'Yes. Fitness creators can build 21-day, 30-day, or 6-week challenge curriculums, enroll cohort participants via email, and provide every participant with an individual daily task checklist. Coaches can monitor participant completion rates, track streaks, and identify which participants need extra motivation to finish strong.'
    },
    {
      q: 'Can dietitians and other health professionals customize their programs?',
      a: 'Absolutely. Careloop is entirely configurable. You can create custom routines with specific frequencies (Daily, 3x/week, Weekends), detailed guidelines, and target metrics (e.g. 2.5L hydration, 30g morning protein, or 3 plant varieties per meal). Programs can be saved as reusable templates and assigned to individual clients with one click.'
    },
    {
      q: 'Do participants need to install an app?',
      a: 'No. Careloop provides a responsive, web-based participant portal that works seamlessly in any browser on iPhone, Android, tablet, or desktop. Participants simply click their invite link or sign in with their Google account to access their daily checklist without app store friction.'
    },
    {
      q: 'Does Careloop currently send WhatsApp reminders?',
      a: 'Not in this initial MVP release. Real-world WhatsApp delivery requires third-party API infrastructure (WhatsApp Cloud API) and background cron queues. In the current release, Careloop provides an interactive High-Fidelity Reminder Simulator so you can preview reminder copy and test incoming simulated replies ("Done", "Skipped", "Need help"). Automated two-way WhatsApp integration is scheduled for our v2 release.'
    },
    {
      q: 'Can participants track their progress?',
      a: 'Yes. Participants have a dedicated personal portal where they can view their assigned program duration, current day progress, verified completion score, active consecutive streaks, and past check-in logs. They can also submit reflection notes alongside their daily completions.'
    },
    {
      q: 'How does pricing work?',
      a: 'Careloop proposes a predictable tier ladder based strictly on active participant capacity: Starter (₹499/mo for up to 25 participants), Growth (₹1,499/mo for up to 100 participants), and Scale (₹2,999/mo for up to 300 participants). There are no per-seat staff penalties. As an early validation prototype, registration is free and payment processing is not yet connected.'
    },
    {
      q: 'Is the product available yet?',
      a: 'Careloop is currently in early-access validation. A fully functional interactive MVP is accessible today through our online sandbox demo, allowing you to explore the practitioner dashboard, participant portal, and program templates immediately. We are onboarding private cohorts of early practitioners who request early access.'
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white border-t border-[#E8EAE7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Common questions about Careloop.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Straightforward, transparent answers about our platform architecture, roadmap, and capabilities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx}
                className="rounded-2xl border border-[#E8EAE7] bg-[#FAFAF8] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#18231C] hover:text-[#2D6A4F] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="shrink-0 text-gray-400">
                    {isOpen ? <IconChevronUp className="w-5 h-5" /> : <IconChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C6E63] leading-relaxed border-t border-[#F0F2EF] animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
