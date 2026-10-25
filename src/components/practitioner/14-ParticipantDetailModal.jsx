import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { 
  IconCheckCircle, 
  IconXCircle, 
  IconClock, 
  IconFlame, 
  IconTrash, 
  IconEdit, 
  IconClipboardList,
  IconAlertCircle
} from '../Icons.jsx';

export const ParticipantDetailModal = ({ 
  isOpen, 
  onClose, 
  participant, 
  completions, 
  programs, 
  onUpdateParticipant,
  onArchiveParticipant,
  onAssignProgram
}) => {
  if (!participant) return null;

  // Resolve a recorded completion's task ID to its human title using the participant's current program (fall back to the raw ID for legacy/unknown tasks)
  const participantProgram = (programs || []).find(pr => pr.id === participant.currentProgramId);
  const taskTitleFor = (taskId) => participantProgram?.tasks?.find(t => t.id === taskId)?.title || taskId;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(participant.name);
  const [email, setEmail] = useState(participant.email);
  const [phone, setPhone] = useState(participant.phone || '');
  const [notes, setNotes] = useState(participant.notes || '');
  const [status, setStatus] = useState(participant.enrollmentStatus || 'active');
  const [assigningProgram, setAssigningProgram] = useState(false);
  const [newProgramId, setNewProgramId] = useState(participant.currentProgramId || '');

  // Filter completions for this participant
  const participantCompletions = completions
    .filter(c => c.participantId === participant.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalLogs = participantCompletions.length;
  const completedLogs = participantCompletions.filter(c => c.status === 'completed').length;
  const calculatedRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : participant.completionRate || 0;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await onUpdateParticipant(participant.id, {
      name,
      email,
      phone,
      notes,
      enrollmentStatus: status
    });
    setIsEditing(false);
  };

  const handleProgramSwitch = async () => {
    if (newProgramId && newProgramId !== participant.currentProgramId) {
      await onAssignProgram(participant.id, newProgramId);
      setAssigningProgram(false);
    }
  };

  const handleArchive = async () => {
    if (window.confirm(`Archive ${participant.name}? Their history will be preserved, and their seat will be freed up.`)) {
      await onArchiveParticipant(participant.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={participant.name}
      subtitle={`Enrolled on ${participant.startDate || 'N/A'} • ${participant.category || 'General Health'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Top Status & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF8] p-4 rounded-2xl border border-[#E8EAE7]">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Adherence Rate</span>
            <div className="text-xl font-extrabold text-[#18231C] mt-0.5">
              {calculatedRate}%
            </div>
            <span className="text-[10px] text-gray-500">{completedLogs} of {totalLogs} logged</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Active Streak</span>
            <div className="text-xl font-extrabold text-amber-600 mt-0.5 flex items-center gap-1">
              <IconFlame className="w-5 h-5 text-amber-500" />
              {participant.streakDays || 0} days
            </div>
            <span className="text-[10px] text-gray-500">Consecutive days</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Program Progress</span>
            <div className="text-xl font-extrabold text-[#2D6A4F] mt-0.5">
              Day {participant.currentDay || 1}
            </div>
            <span className="text-[10px] text-gray-500">of {participant.totalDays || 21} days total</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400">Enrollment Status</span>
            <div className="mt-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                participant.enrollmentStatus === 'active' ? 'bg-emerald-100 text-emerald-800' :
                participant.enrollmentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-700'
              }`}>
                {participant.enrollmentStatus}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-1">Last: {participant.lastActivityDate || 'None'}</span>
          </div>
        </div>

        {/* Assigned Program Panel */}
        <div className="p-4 rounded-xl border border-[#E8EAE7] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Currently Assigned Program</span>
            <h4 className="text-sm font-bold text-[#18231C] mt-0.5">
              {participant.currentProgramTitle || 'No Program Currently Assigned'}
            </h4>
          </div>
          <div>
            {assigningProgram ? (
              <div className="flex items-center gap-2">
                <select
                  value={newProgramId}
                  onChange={(e) => setNewProgramId(e.target.value)}
                  className="text-xs p-1.5 border border-gray-300 rounded-lg bg-white"
                >
                  {programs.filter(p => !p.archived).map(pr => (
                    <option key={pr.id} value={pr.id}>{pr.title}</option>
                  ))}
                </select>
                <button
                  onClick={handleProgramSwitch}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332]"
                >
                  Save
                </button>
                <button
                  onClick={() => setAssigningProgram(false)}
                  className="px-2 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAssigningProgram(true)}
                className="text-xs font-semibold text-[#2D6A4F] hover:underline flex items-center gap-1"
              >
                <IconClipboardList className="w-3.5 h-3.5" />
                Change Program
              </button>
            )}
          </div>
        </div>

        {/* Edit Profile or Display Info */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 bg-[#FAFAF8] p-4 rounded-xl border border-[#E8EAE7]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18231C]">Edit Profile Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700">Practitioner Private Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2 border rounded-lg bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332]"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl bg-white border border-[#E8EAE7]">
            <div className="space-y-1 text-xs">
              <div><span className="text-gray-400">Email:</span> <span className="font-semibold text-gray-800">{participant.email}</span></div>
              <div><span className="text-gray-400">Phone:</span> <span className="text-gray-800">{participant.phone || 'Not provided'}</span></div>
              <div><span className="text-gray-400">Practitioner Notes:</span> <span className="text-gray-700 italic">{participant.notes || 'No private notes'}</span></div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-[#2D6A4F] font-semibold hover:underline flex items-center gap-1 self-start"
            >
              <IconEdit className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>
        )}

        {/* Task Completion Log & History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18231C]">
              Recent Activity & Check-In History ({participantCompletions.length} records)
            </h4>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {participantCompletions.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs bg-[#FAFAF8] rounded-xl border border-dashed border-[#E8EAE7]">
                No task completions recorded yet for this participant.
              </div>
            ) : (
              participantCompletions.map((comp) => {
                const isCompleted = comp.status === 'completed';
                const isSkipped = comp.status === 'skipped';

                return (
                  <div key={comp.id} className="p-3 rounded-xl bg-[#FAFAF8] border border-[#F0F2EF] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {isCompleted ? (
                        <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : isSkipped ? (
                        <IconXCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <IconClock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-[#18231C]">
                          Task: {taskTitleFor(comp.taskId)}
                        </div>
                        {comp.note && (
                          <div className="text-gray-600 italic text-[11px] mt-0.5">
                            "{comp.note}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-500 shrink-0">
                      <span>{comp.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' :
                        isSkipped ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer actions: Archive */}
        <div className="pt-4 border-t border-[#F0F2EF] flex items-center justify-between">
          <button
            type="button"
            onClick={handleArchive}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 hover:underline"
          >
            <IconTrash className="w-3.5 h-3.5" />
            Archive Participant (Free Seat)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
};
