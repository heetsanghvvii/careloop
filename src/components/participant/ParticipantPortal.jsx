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
              className="p-1.5 text-gray-400 hover:text-[#18231C] hover:bg-[#F4F6F3] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Return to Practitioner View"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit to Practice</span>
            </button>
            <div className="border-l border-gray-200 pl-3">
              <span className="text-sm font-extrabold text-[#18231C]">
                {participant.name}
              </span>
              <span className="text-[10px] text-[#2D6A4F] font-bold block -mt-0.5">
                Participant Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <IconFlame className="w-3.5 h-3.5 text-amber-500" />
              <span>{participant.streakDays || 0}d streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Active Program Card */}
        <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white rounded-3xl p-6 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3E4D7] bg-white/10 px-2.5 py-0.5 rounded-full">
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
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#52B788] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((participant.currentDay || 1) / (participant.totalDays || 21)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-[#E8EAE7] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'today'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Daily Checklist
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            My Progress & Streak
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-[#2D6A4F] text-[#1B4332]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Check-In Log
          </button>
        </div>

        {/* TAB 1: DAILY CHECKLIST */}
        {activeTab === 'today' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Date Selector Row */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E8EAE7]">
              <span className="text-xs font-bold text-[#18231C]">
                Date: {selectedDate === today ? 'Today' : selectedDate}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedDate(getIsoDateOffset(-1))}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    selectedDate === getIsoDateOffset(-1) ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setSelectedDate(today)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    selectedDate === today ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-600'
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
                        ? 'bg-[#FFFDF9] border-[#FCE6B2]' 
                        : 'bg-white border-[#E8EAE7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
                            {task.category || 'Action'}
                          </span>
                          <span className="text-[10px] text-gray-400">
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
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                            <IconCheckCircle className="w-3.5 h-3.5" />
                            Done
                          </span>
                        )}
                        {isSkipped && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                            <IconXCircle className="w-3.5 h-3.5" />
                            Skipped
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Check-in Note Input */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <input
                        type="text"
                        placeholder="Add quick reflection note (e.g. Completed with 12kg dumbbells)..."
                        value={checkinNotes[task.id] !== undefined ? checkinNotes[task.id] : (comp?.note || '')}
                        onChange={(e) => setCheckinNotes({ ...checkinNotes, [task.id]: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {comp?.updatedAt ? `Saved at ${new Date(comp.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not yet logged'}
                      </span>

                      <div className="flex gap-2">
                        <button
                          disabled={submittingTaskId === task.id}
                          onClick={() => handleUpdateTaskStatus(task.id, 'skipped')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            isSkipped
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Mark Skipped
                        </button>
                        <button
                          disabled={submittingTaskId === task.id}
                          onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 ${
                            isCompleted
                              ? 'bg-emerald-700 text-white'
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
            <div className="p-3 bg-white rounded-xl border border-[#E8EAE7] text-[11px] text-[#5C6E63] text-center">
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
                  <span className="text-[10px] uppercase font-bold text-gray-400">Completion Score</span>
                  <div className="text-2xl font-extrabold text-[#2D6A4F] mt-1">{adherenceRate}%</div>
                  <span className="text-[10px] text-gray-500">{completedCount} tasks achieved</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E8EAE7]">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Current Streak</span>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-1">
                    <IconFlame className="w-6 h-6 text-amber-500" />
                    {participant.streakDays || 0} Days
                  </div>
                  <span className="text-[10px] text-gray-500">Consecutive adherence</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0F2EF]">
                <h4 className="text-xs font-bold text-[#18231C] mb-2">Coach Guidance & Protocols</h4>
                <p className="text-xs text-gray-600 bg-[#FAFAF8] p-3 rounded-xl border border-[#E8EAE7] leading-relaxed">
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
              <div className="text-center py-8 bg-white rounded-2xl border border-[#E8EAE7] text-gray-400 text-xs">
                No check-in entries recorded yet.
              </div>
            ) : (
              myCompletions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((comp) => {
                  const isCompleted = comp.status === 'completed';
                  const isSkipped = comp.status === 'skipped';

                  return (
                    <div key={comp.id} className="p-3.5 rounded-xl bg-white border border-[#E8EAE7] text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            isCompleted ? 'bg-emerald-100 text-emerald-800' :
                            isSkipped ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {comp.status}
                          </span>
                          <span className="font-semibold text-gray-700">{comp.date}</span>
                        </div>
                        <div className="font-medium text-[#18231C] mt-1">
                          Task: {comp.taskId}
                        </div>
                        {comp.note && (
                          <div className="text-gray-600 italic text-[11px] mt-1 bg-[#FAFAF8] p-2 rounded-lg border border-gray-100">
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

      </main>
    </div>
  );
};
