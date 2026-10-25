import React from 'react';
import { IconAlertCircle, IconCheckCircle } from '../Icons.jsx';

export const TheProblem = () => {
  const challenges = [
    {
      num: '01',
      title: 'Plans get lost across chats, documents, spreadsheets, and apps.',
      desc: 'Clients receive a PDF or spreadsheet, save it somewhere on their phone, and lose track within days. There is no natural daily home for their assigned actions.'
    },
    {
      num: '02',
      title: 'Professionals struggle to know whether participants are following through.',
      desc: 'Without structured check-ins, silence is the only update you receive. By the time a client admits they fell off track, weeks of momentum have already been lost.'
    },
    {
      num: '03',
      title: 'Following up manually with every participant becomes difficult as programs grow.',
      desc: 'Checking in individually over messaging apps works for five clients, but quickly turns into hours of administrative chasing when managing twenty or fifty participants.'
    }
  ];

  return (
    <section className="py-20 bg-[#F4F6F3] border-y border-[#E8EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E3E1B] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            The Shared Coaching Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18231C] tracking-tight">
            Sending the plan is the easy part.
          </h2>
          <p className="text-sm sm:text-base text-[#5C6E63] leading-relaxed">
            Whether you run a high-ticket transformation challenge or clinical rehabilitation routines, advice alone rarely guarantees daily action.
          </p>
        </div>

        {/* 3 Relatable Challenges Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {challenges.map((c) => (
            <div 
              key={c.num}
              className="bg-white p-7 rounded-2xl border border-[#E8EAE7] shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors"
            >
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Problem {c.num}
                </span>
                <h3 className="text-base font-bold text-[#18231C] mt-4 leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-[#5C6E63] mt-2.5 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Concise Takeaway Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-5 rounded-2xl bg-[#EBF7EE] border border-[#BDE8C6] text-center shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] mb-1">
            The Solution
          </div>
          <p className="text-sm sm:text-base font-bold text-[#1B4332]">
            Careloop brings programs, daily actions, and progress into one workflow.
          </p>
        </div>

      </div>
    </section>
  );
};
