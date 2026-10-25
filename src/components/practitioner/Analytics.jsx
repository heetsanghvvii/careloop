import React from 'react';
import { 
  IconBarChart, 
  IconTrendingUp, 
  IconDownload, 
  IconUsers, 
  IconCheckCircle, 
  IconXCircle, 
  IconAlertCircle,
  IconClock,
  IconShield
} from '../Icons.jsx';
import { getIsoDateOffset } from '../../data/initialDemoData.js';

export const Analytics = ({ workspace, participants, programs, completions }) => {
  const activeParticipants = participants.filter(p => !p.archived);

  // Overall computations
  const totalLogs = completions.length;
  const completedLogs = completions.filter(c => c.status === 'completed').length;
  const skippedLogs = completions.filter(c => c.status === 'skipped').length;
  const pendingLogs = completions.filter(c => c.status === 'pending').length;

  const overallAdherenceRate = totalLogs > 0 
    ? Math.round((completedLogs / totalLogs) * 100) 
    : 0;

  // 7-day daily adherence trend
  const past7Days = Array.from({ length: 7 }, (_, i) => getIsoDateOffset(i - 6));
  const dailyTrend = past7Days.map(dateStr => {
    const dayCompletions = completions.filter(c => c.date === dateStr);
    const completed = dayCompletions.filter(c => c.status === 'completed').length;
    const skipped = dayCompletions.filter(c => c.status === 'skipped').length;
    const total = dayCompletions.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Day of week name
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      date: dateStr,
      label: dayName,
      completed,
      skipped,
      total,
      rate
    };
  });

  // Participant Adherence Ranking
  const rankedParticipants = [...activeParticipants].sort((a, b) => b.completionRate - a.completionRate);

  // CSV Export Functionality
  const handleExportCSV = () => {
    const headers = ['Participant Name', 'Email', 'Category', 'Program', 'Enrollment Status', 'Completion Rate (%)', 'Streak (Days)', 'Last Activity Date', 'Practitioner Notes'];
    const rows = activeParticipants.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.category || 'General'}"`,
      `"${(p.currentProgramTitle || '').replace(/"/g, '""')}"`,
      `"${p.enrollmentStatus}"`,
      p.completionRate,
      p.streakDays || 0,
      `"${p.lastActivityDate || 'N/A'}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `careloop_workspace_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header with CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <h2 className="text-xl font-extrabold text-[#18231C]">
            Progress Analytics & Reports
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Objective adherence tracking and completion velocity calculated from raw check-in records.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-white border border-[#D5D9D4] text-[#18231C] text-xs font-semibold hover:bg-[#F4F6F3] transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <IconDownload className="w-4 h-4 text-[#2D6A4F]" />
          Export Workspace Data (CSV)
        </button>
      </div>

      {/* Top Aggregation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Overall Adherence
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#18231C]">
              {overallAdherenceRate}%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Ratio of completed tasks over all recorded checklist items
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total Completed Tasks
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">
              {completedLogs}
            </span>
            <span className="text-xs text-gray-400">actions</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">
            Verified check-in executions
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Skipped or Postponed
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {skippedLogs}
            </span>
            <span className="text-xs text-gray-400">logged skips</span>
          </div>
          <p className="mt-2 text-[11px] text-amber-700 font-medium">
            Transparently documented by participant
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Enrolled Active Cohort
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2D6A4F]">
              {activeParticipants.length}
            </span>
            <span className="text-xs text-gray-400">participants</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Across {programs.filter(p => !p.archived).length} assigned programs
          </p>
        </div>

      </div>

      {/* 7-Day Adherence Velocity Chart & Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E8EAE7] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-[#18231C]">
              7-Day Daily Completion Trend
            </h3>
            <p className="text-xs text-gray-500">
              Daily adherence velocity across all enrolled cohort participants.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2D6A4F]" />
              <span className="text-gray-600">Completed Rate %</span>
            </div>
          </div>
        </div>

        {/* Dynamic CSS Bar Graph */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-[#F0F2EF]">
          {dailyTrend.map((day) => {
            const heightPercent = day.total > 0 ? Math.max(12, day.rate) : 6;

            return (
              <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-bold text-gray-700 mb-1 group-hover:text-[#2D6A4F] transition-colors">
                  {day.total > 0 ? `${day.rate}%` : '—'}
                </div>
                <div className="w-full max-w-[42px] bg-gray-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-32">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      day.total > 0 
                        ? 'bg-gradient-to-t from-[#1B4332] to-[#2D6A4F] group-hover:to-[#52B788]' 
                        : 'bg-gray-200'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-500 mt-2">
                  {day.label}
                </span>
                <span className="text-[9px] text-gray-400">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span>* Minimum 1 recorded check-in required to calculate daily adherence.</span>
          <span className="font-medium text-gray-700">7-Day Cohort Baseline</span>
        </div>
      </div>

      {/* Participant Adherence Leaderboard */}
      <div className="bg-white rounded-2xl border border-[#E8EAE7] p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#18231C] mb-1">
          Participant Adherence Distribution
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Ranked by verified completion percentage to quickly spotlight participants who thrive vs those needing assistance.
        </p>

        <div className="space-y-3">
          {rankedParticipants.map((p) => {
            const isAtRisk = p.completionRate < 60;

            return (
              <div 
                key={p.id}
                className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#18231C]">{p.name}</span>
                    <span className="text-[10px] text-gray-400">({p.email})</span>
                    {isAtRisk && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        At Risk (Follow-up advised)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Program: <span className="text-gray-700 font-medium">{p.currentProgramTitle || 'Unassigned'}</span>
                    {' • '}Day {p.currentDay || 1} of {p.totalDays || 21}
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Streak</div>
                    <div className="font-bold text-sm text-gray-700">{p.streakDays || 0}d</div>
                  </div>

                  <div className="w-32">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Adherence</span>
                      <span className={
                        p.completionRate >= 80 ? 'text-emerald-700' :
                        p.completionRate >= 60 ? 'text-amber-700' : 'text-rose-700'
                      }>
                        {p.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          p.completionRate >= 80 ? 'bg-[#2D6A4F]' :
                          p.completionRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${p.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimers & Methodology */}
      <div className="p-4 rounded-xl bg-[#F8F9F7] border border-[#E8EAE7] text-xs text-[#5C6E63] space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#18231C]">
          <IconShield className="w-4 h-4 text-[#2D6A4F]" />
          Measurement Transparency & Clinical Integrity
        </div>
        <p>
          Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice. Adherence metrics reflect participant-logged check-ins, not clinical diagnosis or therapeutic guarantees.
        </p>
      </div>

    </div>
  );
};
