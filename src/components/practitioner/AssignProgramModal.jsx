import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { IconClipboardList } from '../Icons.jsx';

export const AssignProgramModal = ({ 
  isOpen, 
  onClose, 
  program, 
  participants, 
  onAssign 
}) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeParticipants = participants.filter(p => !p.archived);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedParticipantId || !program) return;

    setIsSubmitting(true);
    try {
      await onAssign(selectedParticipantId, program.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Program to Participant"
      subtitle={`Assign "${program.title}" (${program.durationDays} Days)`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#18231C] mb-1.5">
            Select Enrolled Participant *
          </label>
          <select
            required
            value={selectedParticipantId}
            onChange={(e) => setSelectedParticipantId(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
          >
            <option value="">-- Choose Participant --</option>
            {activeParticipants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email}) - {p.currentProgramTitle || 'No active program'}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E8EAE7] text-xs space-y-1.5 text-gray-600">
          <div className="font-semibold text-[#18231C]">Assignment Details:</div>
          <div>• Program: <span className="font-medium text-gray-800">{program.title}</span></div>
          <div>• Duration: <span className="font-medium text-gray-800">{program.durationDays} days</span></div>
          <div>• Tasks included: <span className="font-medium text-gray-800">{program.tasks?.length || 0} daily actions</span></div>
          <p className="text-[11px] text-gray-400 mt-1">
            Assigning will start the participant at Day 1 and reset their daily task checklist.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F2EF]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedParticipantId || isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] disabled:opacity-50"
          >
            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
