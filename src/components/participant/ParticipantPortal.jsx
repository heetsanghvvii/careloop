import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  IconCheckCircle, 
  IconXCircle, 
  IconCircle, 
  IconFlame, 
  IconCalendar, 
  IconClock, 
  IconSend, 
  IconTrendingUp,
  IconArrowLeft,
  IconShield,
  IconSparkles
} from '../Icons.jsx';
import { getIsoDateOffset } from '../../data/initialDemoData.js';

export const ParticipantPortal = ({ 
  participant, 
  program, 
  completions, 
  onRecordCompletion, 
  onBackToPractitioner 
}) => {
  const today = getIsoDateOffset(0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'history' | 'progress'
  const [checkinNotes, setCheckinNotes] = useState({});
  const [submittingTaskId, setSubmittingTaskId] = useState(null);

  if (!participant) return null;

  // Filter completions for this participant
  const myCompletions = completions.filter(c => c.participantId === participant.id);
  const selectedDateCompletions = myCompletions.filter(c => c.date === selectedDate);

  // Program tasks
  const programTasks = program?.tasks || [
    {
      id: 'task-gen-1',
      title: 'Morning Hydration & Light',
      description: 'Drink 500ml water and get 15 mins sunlight.',
      frequency: 'Daily',
      category: 'Habits',
      targetMetric: '500 ml'
    },
    {
      id: 'task-gen-2',
      title: 'Prescribed Movement Session',
      description: 'Execute today\'s training or mobility circuit.',
      frequency: 'Daily',
      category: 'Movement',
      targetMetric: '30 mins'
    }
  ];

  // Adherence calculation
  const totalMyCompletions = myCompletions.length;
  const completedCount = myCompletions.filter(c => c.status === 'completed').length;
  const adherenceRate = totalMyCompletions > 0 
    ? Math.round((completedCount / totalMyCompletions) * 100) 
    : participant.completionRate || 0;

  // Handle task status update
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setSubmittingTaskId(taskId);
    const note = checkinNotes[taskId] || '';
    try {
      await onRecordCompletion(participant.id, taskId, selectedDate, newStatus, note);
    } finally {
      setSubmittingTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] pb-16">
      
      {/* Top Participant Navigation Header */}
      <header className="bg-white border-b border-[#E8EAE7] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPractitioner}
              className="p-2 text-[#5C6E63] hover:text-[#18231C] hover:bg-[#F8F9F7] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Practitioner View"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit to Practice</span>
            </button>
            <div className="border-l border-[#E8EAE7] pl-3">
              <span className="text-sm font-extrabold text-[#18231C]">
                {participant.name}
              </span>
              <span className="text-[10px] text-[#2D6A4F] font-bold block -mt-0.5">
                Participant Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <IconFlame className="w-3.5 h-3.5 text-amber-500" />
              <span>{participant.streakDays || 0}d streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Active Program Card */}
        <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8F3DC] bg-white/10 px-2.5 py-0.5 rounded-full">
                {program?.category || 'Health Program'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-tight">
                {program?.title || participant.currentProgramTitle || 'Active Program'}
              </h2>
              <p className="text-xs text-[#D8F3DC] mt-1 leading-relaxed line-clamp-2">
                {program?.description || 'Follow your daily prescribed actions to build lasting health habits.'}
              </p>
            </div>
          </div>

          {/* Program Timeline Bar */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex justify-between items-center text-xs text-[#D8F3DC] font-medium mb-1.5">
              <span>Day {participant.currentDay || 1} of {participant.totalDays || 21}</span>
              <span className="font-bold text-white">{adherenceRate}% Adherence</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#52B788] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((participant.currentDay || 1) / (participant.totalDays || 21)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-[#E8EAE7] text-xs">
          <button
            onClick={() => setActiveTab('today')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'today'
                ? 'border-[#2D6A4F] text-[#1B4332] font-bold'
                : 'border-transparent text-[#5C6E63] font-semibold hover:text-[#18231C]'
            }`}
          >
            Daily Checklist
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-[#2D6A4F] text-[#1B4332] font-bold'
                : 'border-transparent text-[#5C6E63] font-semibold hover:text-[#18231C]'
            }`}
          >
            My Progress & Streak
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#2D6A4F] text-[#1B4332] font-bold'
                : 'border-transparent text-[#5C6E63] font-semibold hover:text-[#18231C]'
            }`}
          >
            Check-In Log
          </button>
        </div>

        {/* TAB 1: DAILY CHECKLIST */}
        {activeTab === 'today' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Date Selector Row */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E8EAE7] shadow-xs">
              <span className="text-xs font-bold text-[#18231C]">
                Date: {selectedDate === today ? 'Today' : selectedDate}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedDate(getIsoDateOffset(-1))}
                  className={`px-3 py-1.5 text-xs rounded-xl transition-colors ${
                    selectedDate === getIsoDateOffset(-1)
                      ? 'bg-[#2D6A4F] text-white font-bold border border-[#2D6A4F] shadow-xs'
                      : 'bg-[#FAFAF8] text-[#5C6E63] border border-[#E8EAE7] font-semibold hover:bg-white hover:text-[#18231C]'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setSelectedDate(today)}
                  className={`px-3 py-1.5 text-xs rounded-xl transition-colors ${
                    selectedDate === today
                      ? 'bg-[#2D6A4F] text-white font-bold border border-[#2D6A4F] shadow-xs'
                      : 'bg-[#FAFAF8] text-[#5C6E63] border border-[#E8EAE7] font-semibold hover:bg-white hover:text-[#18231C]'
                  }`}
                >
                  Today
                </button>
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-3">
              {programTasks.map((task) => {
                const comp = selectedDateCompletions.find(c => c.taskId === task.id);
                const isCompleted = comp?.status === 'completed';
                const isSkipped = comp?.status === 'skipped';
                const isPending = !comp || comp?.status === 'pending';

                return (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-[#F4FAF6] border-[#BDE8C6]' 
                        : isSkipped 
                        ? 'bg-[#FFF9F5] border-[#FCDCC9]' 
                        : 'bg-white border-[#E8EAE7] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] border border-[#BDE8C6]/60 px-2 py-0.5 rounded-md">
                            {task.category || 'Action'}
                          </span>
                          <span className="text-[10px] text-[#7B8B80] font-medium">
                            {task.frequency}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#18231C] mt-1.5">
                          {task.title}
                        </h3>
                        <p className="text-xs text-[#5C6E63] mt-1 leading-relaxed">
                          {task.description}
                        </p>
                        {task.targetMetric && (
                          <div className="mt-2 text-[11px] font-semibold text-[#2D6A4F]">
                            Target: {task.targetMetric}
                          </div>
                        )}
                      </div>

                      {/* Status Indicator */}
                      <div>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B4332] bg-[#EBF7EE] border border-[#BDE8C6] px-2.5 py-0.5 rounded-full">
                            <IconCheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                            Done
                          </span>
                        )}
                        {isSkipped && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <IconXCircle className="w-3.5 h-3.5 text-amber-600" />
                            Skipped
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[11px] font-semibold text-[#7B8B80] bg-[#FAFAF8] border border-[#E8EAE7] px-2.5 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Check-in Note Input */}
                    <div className="mt-3 pt-3 border-t border-[#F0F2EF]">
                      <input
                        type="text"
                        placeholder="Add quick reflection note (e.g. Completed with 12kg dumbbells)..."
                        value={checkinNotes[task.id] !== undefined ? checkinNotes[task.id] : (comp?.note || '')}
                        onChange={(e) => setCheckinNotes({ ...checkinNotes, [task.id]: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#E8EAE7] bg-[#FAFAF8] text-[#18231C] placeholder:text-gray-400 focus:bg-white focus:border-[#2D6A4F] focus:outline-hidden transition-colors"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-[#7B8B80]">
                        {comp?.updatedAt ? `Saved at ${new Date(comp.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not yet logged'}
                      </span>

                      <div className="flex gap-2">
                        <button
                          disabled={submittingTaskId === task.id}
                          onClick={() => handleUpdateTaskStatus(task.id, 'skipped')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                            isSkipped
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-[#5C6E63] border-[#E8EAE7] hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                          }`}
                        >
                          Mark Skipped
                        </button>
                        <button
                          disabled={submittingTaskId === task.id}
                          onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 ${
                            isCompleted
                              ? 'bg-[#1B4332] text-[#D8F3DC] border border-[#2D6A4F]'
                              : 'bg-[#2D6A4F] text-white hover:bg-[#1B4332]'
                          }`}
                        >
                          <IconCheckCircle className="w-3.5 h-3.5" />
                          {isCompleted ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note on missing records */}
            <div className="p-3.5 bg-[#FAFAF8] rounded-2xl border border-[#E8EAE7] text-xs text-[#5C6E63] text-center">
              💡 <em>Honest tracking builds consistency: Careloop treats skipped or pending tasks as natural variance, never failure.</em>
            </div>
          </div>
        )}

        {/* TAB 2: PROGRESS & STREAK */}
        {activeTab === 'progress' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#18231C]">Personal Adherence Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E63]">Completion Score</span>
                  <div className="text-2xl font-extrabold text-[#2D6A4F] mt-1">{adherenceRate}%</div>
                  <span className="text-[11px] text-[#7B8B80]">{completedCount} tasks achieved</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6E63]">Current Streak</span>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-1">
                    <IconFlame className="w-6 h-6 text-amber-500" />
                    {participant.streakDays || 0} Days
                  </div>
                  <span className="text-[11px] text-[#7B8B80]">Consecutive adherence</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0F2EF]">
                <h4 className="text-xs font-bold text-[#18231C] mb-2">Coach Guidance & Protocols</h4>
                <p className="text-xs text-[#1B4332] bg-[#F4FAF6] p-3.5 rounded-xl border border-[#BDE8C6] leading-relaxed">
                  {program?.guidelines || 'Stay consistent. Hydrate well and record your check-ins every evening.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHECK-IN LOG */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-[#18231C]">
              Past Check-In Records ({myCompletions.length})
            </h3>

            {myCompletions.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-[#E8EAE7] text-[#7B8B80] text-xs">
                No check-in entries recorded yet.
              </div>
            ) : (
              myCompletions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((comp) => {
                  const isCompleted = comp.status === 'completed';
                  const isSkipped = comp.status === 'skipped';

                  return (
                    <div key={comp.id} className="p-3.5 rounded-xl bg-white border border-[#E8EAE7] shadow-xs text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                            isCompleted ? 'bg-[#EBF7EE] text-[#1B4332] border-[#BDE8C6]' :
                            isSkipped ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-[#FAFAF8] text-[#5C6E63] border-[#E8EAE7]'
                          }`}>
                            {comp.status}
                          </span>
                          <span className="font-bold text-[#18231C]">{comp.date}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#5C6E63] mt-1.5">
                          Task: {comp.taskId}
                        </div>
                        {comp.note && (
                          <div className="text-[#5C6E63] italic text-xs mt-2 bg-[#FAFAF8] p-2.5 rounded-xl border border-[#E8EAE7]">
                            "{comp.note}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Educational & Clinical Disclaimer */}
        <div className="pt-6 pb-4 text-center text-[10px] text-[#7B8B80] leading-relaxed">
          Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
        </div>
      </main>
    </div>
  );
};
