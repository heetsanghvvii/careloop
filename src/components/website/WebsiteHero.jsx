import React, { useState } from 'react';
import { 
  IconCheckCircle, 
  IconChevronRight, 
  IconSparkles, 
  IconFlame, 
  IconClock, 
  IconUsers, 
  IconTrendingUp,
  IconShield
} from '../Icons.jsx';

export const WebsiteHero = ({ onExploreDemo, onOpenEarlyAccess }) => {
  const [activeTabPreview, setActiveTabPreview] = useState('coach'); // 'coach' | 'participant'

  return (
    <section className="pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Balanced Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#1B4332] text-[11px] font-bold tracking-wider uppercase border border-[#D8F3DC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
              FOR COACHES, CREATORS AND HEALTH PROFESSIONALS
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#18231C] tracking-tight leading-[1.12]">
              Your program doesn't end when you send the plan.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#5C6E63] leading-relaxed max-w-xl">
              Careloop helps you turn health advice into daily action with structured programs, participant check-ins, and clear progress tracking.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onExploreDemo}
                className="px-7 py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-xs sm:text-sm hover:bg-[#1B4332] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Explore the demo</span>
                <IconChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenEarlyAccess}
                className="px-6 py-3.5 rounded-xl bg-white text-[#18231C] font-semibold text-xs sm:text-sm border border-[#D5D9D4] hover:bg-[#F4F6F3] transition-colors flex items-center justify-center gap-2"
              >
                Get early access
              </button>
            </div>

            {/* Supporting Trust Line */}
            <div className="pt-1 flex items-center gap-3 text-xs text-[#7B8B80]">
              <span className="flex items-center gap-1.5">
                <IconShield className="w-4 h-4 text-[#2D6A4F]" />
                One place to assign, track, and improve follow-through.
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="hidden sm:inline">No credit card required</span>
            </div>

          </div>

          {/* Right Column: Realistic Product Interface Mockup Preview */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Decorative Subtle Ambient Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#2D6A4F]/15 to-[#52B788]/15 rounded-3xl blur-xl opacity-70" />

              {/* Main Product Frame Card */}
              <div className="relative bg-white rounded-2xl border border-[#E0E2DE] shadow-2xl overflow-hidden text-xs">
                
                {/* Browser / App Header bar */}
                <div className="bg-[#FAFAF8] px-4 py-3 border-b border-[#E8EAE7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <span className="ml-2 font-mono text-[10px] text-gray-400">app.careloop.health/workspace</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-300 text-[9px] font-bold text-amber-800 uppercase tracking-wide">Synthetic preview · sample data</span>
                  </div>

                  {/* Interactive View Toggle */}
                  <div className="flex items-center bg-[#F0F2EF] p-0.5 rounded-lg text-[10px] font-semibold">
                    <button
                      onClick={() => setActiveTabPreview('coach')}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        activeTabPreview === 'coach' ? 'bg-white text-[#18231C] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Coach Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTabPreview('participant')}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        activeTabPreview === 'participant' ? 'bg-white text-[#18231C] shadow-xs' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Client Checklist
                    </button>
                  </div>
                </div>

                {/* Tab Preview Body: Coach View */}
                {activeTabPreview === 'coach' && (
                  <div className="p-5 space-y-4 animate-in fade-in duration-150">
                    {/* Workspace Top Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7]">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Adherence Rate</span>
                        <span className="text-xl font-extrabold text-[#18231C]">88%</span>
                        <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Across 4 programs</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7]">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Cohort</span>
                        <span className="text-xl font-extrabold text-[#2D6A4F]">24</span>
                        <span className="text-[9px] text-gray-500 block mt-0.5">/ 25 Starter cap</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#FCDCC9]">
                        <span className="text-[10px] uppercase font-bold text-[#9E3E1B] block">Needs Follow-up</span>
                        <span className="text-xl font-extrabold text-[#9E3E1B]">1</span>
                        <span className="text-[9px] text-[#9E3E1B] font-medium block mt-0.5">&gt;3d Inactive</span>
                      </div>
                    </div>

                    {/* Participant Live Check-in Row */}
                    <div className="rounded-xl border border-[#E8EAE7] p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#18231C]">Sarah Chen</span>
                          <span className="text-[10px] text-gray-400">21-Day Habit Plan (Day 13)</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <IconFlame className="w-3 h-3 text-amber-500" />
                          6d streak
                        </span>
                      </div>

                      <div className="bg-[#FAFAF8] p-2.5 rounded-lg border border-[#F0F2EF] text-[11px] text-gray-600 italic">
                        "Woke up naturally at 6:15 AM. Sunlight walk completed. Hydration goal hit."
                      </div>
                    </div>

                    {/* Quick Program Action */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EBF7EE] border border-[#BDE8C6]">
                      <span className="text-[11px] font-semibold text-[#1B4332]">
                        ✓ 4 Starter Program Templates Ready to Deploy
                      </span>
                      <button
                        onClick={onExploreDemo}
                        className="text-[11px] font-bold text-[#2D6A4F] hover:underline"
                      >
                        Preview Live →
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab Preview Body: Participant Mobile Checklist View */}
                {activeTabPreview === 'participant' && (
                  <div className="p-5 space-y-3.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0F2EF]">
                      <div>
                        <span className="font-bold text-[#18231C]">Today's Health Tasks</span>
                        <span className="block text-[10px] text-gray-400">Day 13 of 21 • 3 of 4 completed</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        75% Complete
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#BDE8C6] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-gray-800 line-through opacity-80">Morning Hydration & Sunlight</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F4FAF6] border border-[#BDE8C6] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-gray-800 line-through opacity-80">High-Protein Anchor Meal (30g)</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#E8EAE7] flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          <span className="font-semibold text-[#18231C]">Evening Digital Sunset (8:30 PM)</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
