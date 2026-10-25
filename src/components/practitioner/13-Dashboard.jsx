import React from 'react';
import { 
  IconUsers, 
  IconClipboardList, 
  IconCheckCircle, 
  IconAlertCircle, 
  IconTrendingUp, 
  IconPlus, 
  IconBell, 
  IconCalendar,
  IconClock,
  IconChevronRight
} from '../Icons.jsx';

export const Dashboard = ({ 
  workspace, 
  participants, 
  programs, 
  completions, 
  onNavigateTab, 
  onOpenAddParticipant, 
  onOpenCreateProgram,
  onSelectParticipant
}) => {
  // Calculations derived purely from real records
  const activeParticipants = participants.filter(p => p.enrollmentStatus === 'active' && !p.archived);
  const activePrograms = programs.filter(p => !p.archived);

  // Overall Task Completion Rate across all recorded completions
  const totalRecordedTasks = completions.length;
  const completedTasks = completions.filter(c => c.status === 'completed').length;
  const overallCompletionRate = totalRecordedTasks > 0 
    ? Math.round((completedTasks / totalRecordedTasks) * 100) 
    : 0;

  // Inactivity / Follow-up rule:
  // A participant needs follow-up if:
  // 1. Completion rate is < 60% OR
  // 2. Inactive > 3 days (lastActivityDate is more than 3 days ago)
  const today = new Date().toISOString().split('T')[0];
  const participantsNeedingFollowup = activeParticipants.filter(p => {
    if ((p.currentDay || 1) <= 1) return false; // brand-new clients haven't had a chance to complete yet
    if (p.completionRate < 60) return true;
    if (p.lastActivityDate) {
      const daysDiff = Math.floor((new Date(today) - new Date(p.lastActivityDate)) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 3) return true;
    }
    return false;
  });

  // Recent activity: sort completions by updatedAt / date desc
  const recentCompletions = [...completions]
    .sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date))
    .slice(0, 6);

  // Plan capacity limits
  const planLimits = { Starter: 25, Growth: 100, Scale: 300 };
  const currentLimit = planLimits[workspace?.plan || 'Starter'] || 25;
  const capacityPercent = Math.min(100, Math.round((activeParticipants.length / currentLimit) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Onboarding Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D8F3DC] text-xs font-medium mb-3 backdrop-blur-xs">
              <span>{workspace?.name || 'Workspace'}</span>
              <span>•</span>
              <span className="capitalize">{workspace?.category || 'General Health'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {workspace?.practitionerName || 'Practitioner'}
            </h1>
            <p className="mt-2 text-sm text-[#D8F3DC] max-w-xl leading-relaxed">
              Careloop is tracking your participant adherence loops. Review daily completions, address inactive participants, or assign new program sequences.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={onOpenAddParticipant}
              className="px-4 py-2.5 rounded-xl bg-white text-[#1B4332] text-xs font-bold hover:bg-[#F4F6F3] transition-colors shadow-xs flex items-center gap-2"
            >
              <IconPlus className="w-4 h-4" />
              Add Participant
            </button>
            <button
              onClick={onOpenCreateProgram}
              className="px-4 py-2.5 rounded-xl bg-[#52B788]/20 border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <IconClipboardList className="w-4 h-4" />
              Create Program
            </button>
          </div>
        </div>
      </div>

      {/* Primary Computed Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Active Participants & Quota */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C6E63]">
              Active Participants
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center">
              <IconUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#18231C]">
              {activeParticipants.length}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              / {currentLimit} limit
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#2D6A4F] h-full rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-gray-500">
            <span>{workspace?.plan} Tier</span>
            <span>{capacityPercent}% filled</span>
          </div>
        </div>

        {/* Active Programs */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C6E63]">
              Active Programs
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IconClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#18231C]">
              {activePrograms.length}
            </span>
            <span className="text-xs text-gray-500 font-medium">programs</span>
          </div>
          <div className="mt-3 text-xs text-[#2D6A4F] font-medium flex items-center gap-1 cursor-pointer hover:underline" onClick={() => onNavigateTab('programs')}>
            <span>View program library</span>
            <IconChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C6E63]">
              Task Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <IconTrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#18231C]">
              {overallCompletionRate}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              {completedTasks} completed
            </span>
          </div>
          <div className="mt-3 text-[11px] text-gray-500">
            Computed from {totalRecordedTasks} total recorded check-in entries
          </div>
        </div>

        {/* Follow-up / Inactivity Alert */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          participantsNeedingFollowup.length > 0 
            ? 'bg-[#FFF9F5] border-[#FCDCC9]' 
            : 'bg-white border-[#E8EAE7]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E3E1B]">
              Needs Follow-Up
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <IconAlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#9E3E1B]">
              {participantsNeedingFollowup.length}
            </span>
            <span className="text-xs text-[#9E3E1B] font-medium">participants</span>
          </div>
          <div className="mt-3 text-[11px] text-[#9E3E1B]/90 font-medium">
            {participantsNeedingFollowup.length > 0
              ? 'Adherence <60% or inactive >3 days'
              : 'All participants active & on track'}
          </div>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Participants Needing Follow-up + Quick Participant List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Follow-up Intervention Panel */}
          {participantsNeedingFollowup.length > 0 && (
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#FAD8C3] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-[#8A3314]">
                    Participants At Risk of Program Disengagement
                  </h3>
                </div>
                <button
                  onClick={() => onNavigateTab('reminders')}
                  className="text-xs text-[#8A3314] hover:underline font-semibold flex items-center gap-1"
                >
                  <IconBell className="w-3.5 h-3.5" />
                  Open Reminder Simulator
                </button>
              </div>

              <div className="space-y-3">
                {participantsNeedingFollowup.map(p => (
                  <div 
                    key={p.id}
                    className="p-3.5 rounded-xl bg-white border border-[#FCE6D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#18231C]">{p.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                          {p.completionRate}% completion
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Program: <span className="font-medium text-gray-700">{p.currentProgramTitle}</span>
                        {p.lastActivityDate && ` • Last active: ${p.lastActivityDate}`}
                      </div>
                      {p.lastCheckinNote && (
                        <div className="text-xs text-gray-600 italic mt-1 bg-gray-50 px-2 py-1 rounded-md">
                          "{p.lastCheckinNote}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectParticipant(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#18231C] bg-[#F4F6F3] hover:bg-[#EAEDE8] rounded-lg transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onNavigateTab('reminders')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#C25E29] hover:bg-[#A34B1D] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <IconBell className="w-3.5 h-3.5" />
                        Prompt Follow-up
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Participants Summary Table */}
          <div className="bg-white rounded-2xl border border-[#E8EAE7] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#18231C]">
                  Active Participant Roster
                </h3>
                <p className="text-xs text-gray-500">Live progress snapshot across all assigned health programs</p>
              </div>
              <button
                onClick={() => onNavigateTab('participants')}
                className="text-xs text-[#2D6A4F] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All ({participants.length})</span>
                <IconChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0F2EF] text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="pb-3 font-semibold">Participant</th>
                    <th className="pb-3 font-semibold">Assigned Program</th>
                    <th className="pb-3 font-semibold">Day / Total</th>
                    <th className="pb-3 font-semibold">Adherence</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2EF]">
                  {activeParticipants.slice(0, 5).map(p => (
                    <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="py-3 font-semibold text-[#18231C]">
                        {p.name}
                        <span className="block text-[11px] font-normal text-gray-400">{p.email}</span>
                      </td>
                      <td className="py-3 text-gray-600 max-w-[180px] truncate">
                        {p.currentProgramTitle || 'No program assigned'}
                      </td>
                      <td className="py-3 text-gray-600">
                        Day {p.currentDay || 1} of {p.totalDays || 21}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            p.completionRate >= 80 ? 'text-emerald-700' :
                            p.completionRate >= 60 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {p.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectParticipant(p)}
                          className="text-[#2D6A4F] font-semibold hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Check-in Feed & Quick Loop Guide */}
        <div className="space-y-6">
          
          {/* Recent Activity Log */}
          <div className="bg-white rounded-2xl border border-[#E8EAE7] p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#18231C] mb-1">
              Live Activity & Check-ins
            </h3>
            <p className="text-xs text-gray-500 mb-4">Real check-in records logged by participants</p>

            <div className="space-y-3.5">
              {recentCompletions.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs">
                  No check-ins recorded yet.
                </div>
              ) : (
                recentCompletions.map((c, i) => {
                  const part = participants.find(p => p.id === c.participantId);
                  const isCompleted = c.status === 'completed';
                  const isSkipped = c.status === 'skipped';

                  return (
                    <div key={c.id || i} className="p-3 rounded-xl bg-[#FAFAF8] border border-[#F0F2EF] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#18231C]">
                          {part?.name || 'Participant'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isSkipped ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-1">
                        Task: <span className="font-medium text-gray-700">{c.taskId}</span> • {c.date}
                      </div>
                      {c.note && (
                        <p className="mt-1.5 text-gray-700 italic bg-white p-2 rounded-lg border border-gray-100 text-[11px]">
                          "{c.note}"
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick SaaS Workflow Guide */}
          <div className="bg-[#F8F9F7] rounded-2xl border border-[#E8EAE7] p-5 text-xs text-[#5C6E63] space-y-3">
            <h4 className="font-bold text-[#18231C] text-sm">
              Careloop Operational Loop
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] bg-[#EBF7EE] px-1.5 py-0.5 rounded text-[10px]">1</span>
                <span><strong>Assign:</strong> Invite participants to pre-built habit or rehab routines.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] bg-[#EBF7EE] px-1.5 py-0.5 rounded text-[10px]">2</span>
                <span><strong>Log:</strong> Participants mark tasks complete or skipped from mobile.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#2D6A4F] bg-[#EBF7EE] px-1.5 py-0.5 rounded text-[10px]">3</span>
                <span><strong>Follow Up:</strong> Use Simulated Reminders when adherence dips below 60%.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
