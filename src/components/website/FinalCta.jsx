import React from 'react';
import { IconChevronRight } from '../Icons.jsx';

export const FinalCta = ({ onOpenEarlyAccess, onExploreDemo }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1B4332] via-[#245740] to-[#2D6A4F] text-white text-center relative overflow-hidden">
      {/* Subtle Glow circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#52B788]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A3E4D7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#D8F3DC] text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
          Take the Next Step
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Build better follow-through into every program.
        </h2>

        <p className="text-base sm:text-lg text-[#D8F3DC] max-w-2xl mx-auto leading-relaxed">
          We're building Careloop for people who help others make meaningful changes to their health and habits.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenEarlyAccess}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#1B4332] text-xs sm:text-sm font-bold hover:bg-[#F4F6F3] transition-all shadow-lg hover:shadow-xl"
          >
            Get early access
          </button>
          
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#52B788]/20 border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group"
          >
            <span>Explore the demo</span>
            <IconChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="pt-2 text-xs text-[#A3E4D7]">
          Early cohort onboarding • Free sandbox preview • Zero card required
        </div>
      </div>
    </section>
  );
};
