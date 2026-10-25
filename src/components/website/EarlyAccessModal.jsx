import React, { useState } from 'react';
import { Modal } from '../Modal.jsx';
import { IconCheckCircle, IconSparkles, IconShield } from '../Icons.jsx';
import { dataService } from '../../firebase/dataService.js';

export const EarlyAccessModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Fitness & Transformation Creator');
  const [participantVolume, setParticipantVolume] = useState('1-25 active clients');
  const [programDescription, setProgramDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Fitness & Transformation Creator',
    'Personal Trainer & Online Coach',
    'Dietitian & Nutritionist',
    'Wellness & Habit Coach',
    'Physiotherapist & Rehabilitation',
    'Clinic & Studio Owner',
    'Other Health Practice'
  ];

  const volumes = [
    '1-25 active clients',
    '26-100 active clients',
    '101-300 active clients',
    '300+ clients / High Volume'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.submitEarlyAccess({
        name,
        email,
        category,
        participantVolume,
        programDescription
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setProgramDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={submitted ? "Registration Confirmed" : "Request Early Access to Careloop"}
      subtitle={submitted ? "Welcome to the early cohorts of Careloop." : "Be among the first health professionals and coaches to turn advice into daily follow-through."}
      maxWidth="max-w-lg"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
            <IconCheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#18231C]">
              You're on the early access priority list!
            </h3>
            <p className="text-xs text-[#5C6E63] max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-[#18231C]">{name}</span>. We've reserved your place for <span className="font-semibold text-[#18231C]">{email}</span> in the upcoming private onboarding cohort for {category}.
            </p>
          </div>

          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E8EAE7] text-left text-xs text-[#405347] space-y-2">
            <div className="font-semibold text-[#18231C] flex items-center gap-1.5">
              <IconSparkles className="w-4 h-4 text-[#2D6A4F]" />
              Early Access Benefits:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#5C6E63]">
              <li>Lock in proposed early-bird pricing (starting at ₹499/mo).</li>
              <li>Free 1-on-1 curriculum migration assistance for existing programs.</li>
              <li>Direct founder channel for feature requests and feedback.</li>
            </ul>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@practice.health"
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Current Client Volume
              </label>
              <select
                value={participantVolume}
                onChange={(e) => setParticipantVolume(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
              >
                {volumes.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231C] mb-1">
              Describe Your Health or Habit Program (Optional)
            </label>
            <textarea
              rows={3}
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              placeholder="e.g. 6-week metabolic reset challenge for 50 online clients, tracking morning sunlight, hydration, and strength splits..."
              className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#F0F2EF]">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <IconShield className="w-3.5 h-3.5 text-emerald-600" />
              Zero spam. Verified privacy.
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] transition-colors shadow-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Register for Early Access'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
