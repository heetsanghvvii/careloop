import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { CATEGORIES } from '../../data/programTemplates.js';
import { IconAlertCircle } from '../Icons.jsx';

export const AddParticipantModal = ({ 
  isOpen, 
  onClose, 
  programs, 
  onAddParticipant,
  currentPlan = 'Starter',
  currentActiveCount = 0
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [programId, setProgramId] = useState(''); // deliberate choice: default '-- Assign Later --', never silently pre-assign the first template
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planLimits = { Starter: 25, Growth: 100, Scale: 300 };
  const maxLimit = planLimits[currentPlan] || 25;
  const isAtLimit = currentActiveCount >= maxLimit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter participant full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const selectedProgram = programs.find(p => p.id === programId);

    setIsSubmitting(true);
    try {
      await onAddParticipant({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || 'Not provided',
        category,
        currentProgramId: selectedProgram?.id || '',
        currentProgramTitle: selectedProgram?.title || 'Unassigned',
        totalDays: selectedProgram?.durationDays || 21,
        notes: notes.trim() || 'No initial practitioner notes'
      });
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setProgramId(''); // reset: next enrollment must not inherit the previous program choice
      setCategory(CATEGORIES[0]);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add participant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Participant"
      subtitle="Invite a client to follow a structured health and habit program."
      maxWidth="max-w-xl"
    >
      {isAtLimit && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <IconAlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Participant Limit Reached</span>
            <p className="mt-0.5">
              Your <strong>{currentPlan}</strong> plan has reached its limit of {maxLimit} active participants ({currentActiveCount}/{maxLimit}). Please switch or upgrade your plan in the Billing tab before adding more participants.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#18231C] mb-1">
            Participant Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Email Address (For Google Sign-in) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Contact Phone (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 00000"
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Primary Health Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Initial Program Assignment
            </label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
            >
              <option value="">-- Assign Later --</option>
              {programs.filter(p => !p.archived).map(prog => (
                <option key={prog.id} value={prog.id}>
                  {prog.title} ({prog.durationDays}d)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#18231C] mb-1">
            Practitioner Internal Notes (Private to Coach)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Focus areas, past injuries, lifestyle nuances... (Not visible to participant)"
            className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent bg-white"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#F0F2EF]">
          <span className="text-[11px] text-gray-500">
            Capacity: {currentActiveCount} / {maxLimit} used ({currentPlan})
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAtLimit}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs ${
                isAtLimit 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#2D6A4F] hover:bg-[#1B4332]'
              }`}
            >
              {isSubmitting ? 'Enrolling...' : 'Enroll Participant'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
