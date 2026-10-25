import React, { useState } from 'react';
import { 
  IconBell, 
  IconSend, 
  IconClock, 
  IconCheckCircle, 
  IconXCircle, 
  IconAlertCircle, 
  IconPlus,
  IconShield,
  IconMessageSquare
} from '../Icons.jsx';

export const RemindersSimulation = ({ 
  reminders, 
  participants, 
  onAddReminder, 
  onSimulateReply 
}) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState(participants[0]?.id || '');
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');
  const [reminderType, setReminderType] = useState('Adherence Check-in (Prompt)');
  const [customMessage, setCustomMessage] = useState(
    'Hi {name}! Checking in on today\'s program tasks. How is your energy level? Reply "Done" to mark today complete or "Need help" if you need guidance.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const activeParticipants = participants.filter(p => !p.archived);

  const handleQueueReminder = async (e) => {
    e.preventDefault();
    if (!selectedParticipantId) return;

    const participant = participants.find(p => p.id === selectedParticipantId);
    if (!participant) return;

    const formattedMessage = customMessage.replace('{name}', participant.name);

    setIsSubmitting(true);
    try {
      await onAddReminder({
        participantId: participant.id,
        participantName: participant.name,
        participantEmail: participant.email,
        scheduledTime,
        type: reminderType,
        messageText: formattedMessage,
        channel: 'Simulated WhatsApp/SMS'
      });
      setFeedbackNotice(`Simulated reminder queued for ${participant.name} at ${scheduledTime}!`);
      setTimeout(() => setFeedbackNotice(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerReply = async (reminderId, replyType) => {
    await onSimulateReply(reminderId, replyType);
    setFeedbackNotice(`Simulated participant reply "${replyType}" processed and logged in task records!`);
    setTimeout(() => setFeedbackNotice(''), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <h2 className="text-xl font-extrabold text-[#18231C]">
            Interactive Reminder Simulator
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Test and preview future SMS & WhatsApp accountability sequences without sending real messages or paying third-party fees.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF7EE] text-[#1B4332] text-xs font-semibold border border-[#D8F3DC]">
          <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
          <span>Zero-Cost Simulation Mode Active</span>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium animate-in fade-in">
          {feedbackNotice}
        </div>
      )}

      {/* Notice Banner: Technical Integrity & Zero-Billing Guarantee */}
      <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] text-xs text-[#5C6E63] space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-[#18231C] text-sm">
          <IconShield className="w-4 h-4 text-[#2D6A4F]" />
          Infrastructure Architecture Notice
        </div>
        <p className="leading-relaxed">
          True automated background SMS/WhatsApp delivery requires paid third-party infrastructure (Twilio / WhatsApp Cloud API / Cloud Functions cron queues). In strict compliance with the ₹0 budget constraint, Careloop operates an interactive <strong>High-Fidelity Reminder Simulator</strong>. You can configure scheduled reminder copy, preview participant notifications, and simulate participant replies (e.g. "Done", "Skipped", "Need help") to observe how real-time adherence recalculates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Configure New Simulated Reminder */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-[#E8EAE7] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#18231C]">
            Schedule Simulated Prompt
          </h3>

          <form onSubmit={handleQueueReminder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Target Participant *
              </label>
              <select
                required
                value={selectedParticipantId}
                onChange={(e) => setSelectedParticipantId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white font-medium"
              >
                {activeParticipants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currentProgramTitle || 'Unassigned'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#18231C] mb-1">
                  Scheduled Time
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] bg-white font-medium"
                >
                  <option value="07:30 AM">07:30 AM (Morning)</option>
                  <option value="09:00 AM">09:00 AM (Mid-morning)</option>
                  <option value="01:00 PM">01:00 PM (Midday)</option>
                  <option value="06:00 PM">06:00 PM (Evening)</option>
                  <option value="08:30 PM">08:30 PM (Wind-down)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18231C] mb-1">
                  Type
                </label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] bg-white font-medium"
                >
                  <option value="Adherence Check-in (Prompt)">Adherence Prompt</option>
                  <option value="Daily Routine Nudge">Daily Routine Nudge</option>
                  <option value="Recovery & Wind-down">Recovery / Sleep</option>
                  <option value="Re-engagement Alert">Re-engagement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18231C] mb-1">
                Simulated Message Body
              </label>
              <textarea
                rows={4}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#D5D9D4] focus:ring-2 focus:ring-[#2D6A4F] bg-white"
              />
              <span className="text-[10px] text-gray-400">
                Supports {'{name}'} wildcard tag for participant personalized greeting.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedParticipantId}
              className="w-full py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <IconSend className="w-3.5 h-3.5" />
              {isSubmitting ? 'Queueing...' : 'Queue Simulated Reminder'}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Simulated Queue & Interactive Reply Triggers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18231C]">
              Simulated Message Queue ({reminders.length})
            </h3>
            <span className="text-xs text-gray-400">
              Interactive test trigger actions
            </span>
          </div>

          <div className="space-y-4">
            {reminders.map((rem) => {
              const isReplied = rem.status === 'replied';

              return (
                <div 
                  key={rem.id}
                  className="bg-white rounded-2xl border border-[#E8EAE7] p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F2EF] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#18231C]">
                        {rem.participantName}
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        ({rem.scheduledTime})
                      </span>
                      <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
                        {rem.type}
                      </span>
                    </div>

                    <span className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isReplied ? 'bg-purple-100 text-purple-800' :
                      rem.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                      rem.status === 'sent' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {isReplied ? `Replied: "${rem.lastReply}"` : rem.status}
                    </span>
                  </div>

                  {/* Message Bubble Preview */}
                  <div className="bg-[#F8F9F7] p-3.5 rounded-xl border border-[#E8EAE7] text-xs text-[#2A3B31] font-mono leading-relaxed relative">
                    <div className="text-[10px] uppercase font-bold text-gray-400 font-sans mb-1">
                      Outgoing Simulated Message:
                    </div>
                    {rem.messageText}
                  </div>

                  {/* Interactive Response Simulator Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500 font-medium">
                      Simulate Participant Response:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTriggerReply(rem.id, 'Done')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors flex items-center gap-1"
                        title="Simulates participant marking task as Done via WhatsApp/SMS"
                      >
                        <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        "Done"
                      </button>
                      <button
                        onClick={() => handleTriggerReply(rem.id, 'Skipped')}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition-colors flex items-center gap-1"
                        title="Simulates participant replying Skipped"
                      >
                        <IconXCircle className="w-3.5 h-3.5 text-amber-600" />
                        "Skipped"
                      </button>
                      <button
                        onClick={() => handleTriggerReply(rem.id, 'Need help')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold transition-colors flex items-center gap-1"
                        title="Simulates participant requesting coaching help"
                      >
                        <IconAlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        "Need help"
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
