import React, { useState } from 'react';
import { 
  IconCheckCircle, 
  IconUsers, 
  IconClipboardList, 
  IconBarChart, 
  IconTrendingUp, 
  IconFlame, 
  IconClock, 
  IconAlertCircle,
  IconShield
} from '../Icons.jsx';

export const ProductShowcase = ({ onExploreDemo }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const showcaseTabs = [
    { id: 'dashboard', label: 'Practitioner Dashboard', icon: IconTrendingUp },
    { id: 'directory', label: 'Participant Directory', icon: IconUsers },
    { id: 'builder', label: 'Program Builder', icon: IconClipboardList },
    { id: 'checklist', label: 'Daily Task Checklist', icon: IconCheckCircle },
    { id: 'progress', label: 'Participant Progress', icon: IconFlame },
    { id: 'analytics', label: 'Adherence Analytics', icon: IconBarChart }
  ];

  return (
    <section id="product" className="py-24 bg-[#FBFBFA] border-t border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#D8F3DC]">
            Full Workspace Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Everything your program needs, in one workspace.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            From creating habit curriculums to tracking daily execution and analyzing cohort trends, explore the modules that power Careloop.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {showcaseTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2D6A4F] text-white shadow-sm'
                    : 'bg-white text-[#405347] border border-[#E8EAE7] hover:bg-[#F4F6F3] hover:text-[#18231C]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Realistic Interface Preview Canvas */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#E0E2DE] shadow-xl overflow-hidden text-left">
          
          {/* Header Bar */}
          <div className="bg-[#FAFAF8] px-6 py-4 border-b border-[#E8EAE7] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-xs">
                CL
              </div>
              <div>
                <span className="font-bold text-sm text-[#18231C]">
                  {showcaseTabs.find(t => t.id === activeTab)?.label}
                </span>
                <span className="block text-[10px] text-gray-400">
                  Careloop SaaS • Live Interface Simulation
                </span>
              </div>
            </div>

            <button
              onClick={onExploreDemo}
              className="px-3.5 py-1.5 rounded-lg bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold border border-[#BDE8C6] hover:bg-[#D8F3DC] transition-colors"
            >
              Open in Live Demo →
            </button>
          </div>

          {/* Interactive Screen Content Body */}
          <div className="p-6 sm:p-8">
            
            {/* 1. PRACTITIONER DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7]">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Active Participants</span>
                    <div className="text-2xl font-extrabold text-[#18231C] mt-1">24 / 25</div>
                    <span className="text-[10px] text-gray-500">Starter Plan limit</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7]">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Active Programs</span>
                    <div className="text-2xl font-extrabold text-[#2D6A4F] mt-1">4</div>
                    <span className="text-[10px] text-emerald-600 font-medium">Curriculums deployed</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7]">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Overall Completion</span>
                    <div className="text-2xl font-extrabold text-[#18231C] mt-1">88%</div>
                    <span className="text-[10px] text-gray-500">From 18 raw entries</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#FCDCC9]">
                    <span className="text-[#9E3E1B] font-bold uppercase text-[10px]">Needs Follow-up</span>
                    <div className="text-2xl font-extrabold text-[#9E3E1B] mt-1">1</div>
                    <span className="text-[10px] text-[#9E3E1B] font-medium">&gt;3 days inactive</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#FAD8C3] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#8A3314] flex items-center gap-1.5">
                      <IconAlertCircle className="w-4 h-4 text-amber-600" />
                      Client Follow-Up Alert: David Miller (Lumbar Rehab)
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Inactive 4 days
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    "Work deadlines made it tough to get on the floor for bird-dogs." — Adherence dropped to 42%. Follow-up recommended.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PARTICIPANT DIRECTORY */}
            {activeTab === 'directory' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#F0F2EF] text-gray-400 uppercase text-[10px] font-bold">
                        <th className="pb-3">Participant</th>
                        <th className="pb-3">Assigned Program</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Adherence</th>
                        <th className="pb-3">Streak</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F2EF]">
                      <tr className="hover:bg-[#FAFAF8]">
                        <td className="py-3 font-bold text-[#18231C]">
                          Sarah Chen <span className="block text-[10px] text-gray-400 font-normal">sarah.chen@example.com</span>
                        </td>
                        <td className="py-3 text-gray-600">21-Day Habit & Metabolic Reset</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span></td>
                        <td className="py-3 font-bold text-emerald-700">88%</td>
                        <td className="py-3 text-gray-700 font-semibold">6d 🔥</td>
                        <td className="py-3 text-right text-[#2D6A4F] font-bold">View Profile</td>
                      </tr>
                      <tr className="hover:bg-[#FAFAF8]">
                        <td className="py-3 font-bold text-[#18231C]">
                          Marcus Vance <span className="block text-[10px] text-gray-400 font-normal">marcus.v@example.com</span>
                        </td>
                        <td className="py-3 text-gray-600">6-Week Strength & Mobility</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span></td>
                        <td className="py-3 font-bold text-amber-700">74%</td>
                        <td className="py-3 text-gray-700 font-semibold">3d 🔥</td>
                        <td className="py-3 text-right text-[#2D6A4F] font-bold">View Profile</td>
                      </tr>
                      <tr className="hover:bg-[#FAFAF8]">
                        <td className="py-3 font-bold text-[#18231C]">
                          Priya Sharma <span className="block text-[10px] text-gray-400 font-normal">priya.sharma@example.com</span>
                        </td>
                        <td className="py-3 text-gray-600">Mediterranean Protocol</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span></td>
                        <td className="py-3 font-bold text-emerald-700">95%</td>
                        <td className="py-3 text-gray-700 font-semibold">12d 🔥</td>
                        <td className="py-3 text-right text-[#2D6A4F] font-bold">View Profile</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PROGRAM BUILDER */}
            {activeTab === 'builder' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8EAE7] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">Habits & Wellness</span>
                    <h4 className="text-sm font-bold text-[#18231C] mt-1">21-Day Habit & Metabolic Reset</h4>
                    <p className="text-gray-500 mt-0.5">21-Day Duration • Evidence-based circadian alignment</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-white border border-[#D5D9D4] font-semibold text-gray-700">4 Actions</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#E8EAE7] bg-white">
                    <span className="text-[10px] font-bold text-gray-400">Action 01</span>
                    <h5 className="font-bold text-[#18231C]">Morning Circadian Hydration</h5>
                    <p className="text-gray-500 mt-0.5">Drink 500ml water with sea salt before caffeine.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E8EAE7] bg-white">
                    <span className="text-[10px] font-bold text-gray-400">Action 02</span>
                    <h5 className="font-bold text-[#18231C]">Sunlight & Zone 2 Walk</h5>
                    <p className="text-gray-500 mt-0.5">15-20 mins natural light exposure within 60 mins of waking.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DAILY TASK CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="space-y-3 animate-in fade-in duration-150 text-xs max-w-lg mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-[#F0F2EF]">
                  <span className="font-bold text-sm text-[#18231C]">Sarah Chen • Day 13 of 21</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">3 / 4 Done</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F4FAF6] border border-[#BDE8C6] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">500ml Morning Hydration</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F4FAF6] border border-[#BDE8C6] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">20-Min Sunlight Walk</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8EAE7] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    <span className="font-semibold text-[#18231C]">Evening Digital Sunset (8:30 PM)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="px-2 py-1 text-[10px] font-semibold border rounded bg-white">Skip</button>
                    <button className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#2D6A4F] rounded">Complete</button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PARTICIPANT PROGRESS */}
            {activeTab === 'progress' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs max-w-xl mx-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold text-[#A3E4D7]">Client Progress View</span>
                    <span className="text-xs font-bold text-amber-300">🔥 6-Day Streak</span>
                  </div>
                  <div className="text-xl font-extrabold">21-Day Habit & Metabolic Reset</div>
                  <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#52B788] h-full rounded-full" style={{ width: '62%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#D8F3DC]">
                    <span>Day 13 of 21</span>
                    <span>88% Adherence</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. ADHERENCE ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#18231C]">Cohort Adherence Velocity (Last 7 Days)</h4>
                    <p className="text-gray-500">Calculated across all verified action entries</p>
                  </div>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Cohort Avg: 88%
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1 border-b border-[#F0F2EF]">
                  {[80, 85, 90, 88, 92, 85, 88].map((val, i) => (
                    <div key={i} className="flex flex-col items-center h-full justify-end">
                      <span className="text-[9px] font-bold text-gray-500 mb-1">{val}%</span>
                      <div className="w-full bg-[#EBF7EE] rounded-t h-16 flex items-end">
                        <div className="w-full bg-[#2D6A4F] rounded-t" style={{ height: `${val}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">D{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
