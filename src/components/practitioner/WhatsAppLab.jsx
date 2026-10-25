import React, { useState, useRef, useEffect } from 'react';
import { WhatsAppBotEngine } from '../../../server/whatsappBotEngine.js';
import { 
  IconCheckCircle, 
  IconFlame, 
  IconAlertCircle, 
  IconSend, 
  IconShield, 
  IconSparkles,
  IconClock,
  IconRefreshCw
} from '../Icons.jsx';

export const WhatsAppLab = ({ participants, onRecordCompletion }) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState(participants[0]?.id || 'part_001');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '🌿 Good morning Sarah! Dr. Arjun Patel here.\n\nHere are your Day 13 tasks for "21-Day Habit & Metabolic Reset":\n• 500ml Morning Hydration\n• 20-min Sunlight Walk\n• 30g Protein Anchor Meal\n\nReply "Done" when completed or "Need help" if you need guidance!',
      time: '08:00 AM'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastActionToast, setLastActionToast] = useState('');
  const chatBottomRef = useRef(null);

  const activeParticipant = participants.find(p => p.id === selectedParticipantId) || participants[0] || {
    id: 'part_001',
    name: 'Sarah Chen',
    streakDays: 6,
    currentDay: 13,
    totalDays: 21,
    programTitle: '21-Day Habit & Metabolic Reset'
  };

  const botEngine = new WhatsAppBotEngine();

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate realistic network delay (600ms)
    setTimeout(async () => {
      const evaluation = botEngine.evaluateResponse(text, activeParticipant);

      // Trigger actual task updates in Careloop database
      if (evaluation.taskStatus) {
        const today = new Date().toISOString().split('T')[0];
        const taskId = 'task-h1'; // Default primary anchor task
        await onRecordCompletion(
          activeParticipant.id, 
          taskId, 
          today, 
          evaluation.taskStatus, 
          `Via WhatsApp Bot: "${text.trim()}"`
        );
      }

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: evaluation.replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botReply]);

      if (evaluation.action === 'TASK_COMPLETED') {
        setLastActionToast(`✅ Daily task logged! Adherence recomputed & streak updated to ${activeParticipant.streakDays + 1} days.`);
      } else if (evaluation.action === 'TASK_SKIPPED') {
        setLastActionToast(`⏸️ Rest day logged non-punitively. Preserved clinical adherence transparency.`);
      } else if (evaluation.action === 'FLAG_COACH_INTERVENTION') {
        setLastActionToast(`🚩 High-Priority Flag logged on Doctor Dashboard! Coach intervention triggered.`);
      } else {
        setLastActionToast(`📝 Reflection note saved to participant's timeline.`);
      }

      setTimeout(() => setLastActionToast(''), 5000);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `🌿 Good morning ${activeParticipant.name.split(' ')[0]}! Checking in on your daily tasks for "${activeParticipant.currentProgramTitle || 'Diet Protocol'}".\n\nReply "Done" when finished, "Skip" if resting, or "Help" for guidance!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastActionToast('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EAE7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <h2 className="text-xl font-extrabold text-[#18231C]">
              WhatsApp Bot (simulated demo - live Meta integration not connected)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Interactive simulation of patient WhatsApp check-ins. Completion tracking shows self-reported behavior, not proven health outcomes. Careloop supports the professional's plan; it does not provide medical advice.
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-[#D5D9D4] rounded-lg hover:bg-gray-50 self-start sm:self-auto"
        >
          <IconRefreshCw className="w-3.5 h-3.5 text-gray-500" />
          Reset Chat
        </button>
      </div>

      {lastActionToast && (
        <div className="p-3 bg-[#EBF7EE] border border-[#BDE8C6] text-[#1B4332] text-xs rounded-xl font-bold flex items-center gap-2 animate-in fade-in">
          <IconSparkles className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span>{lastActionToast}</span>
        </div>
      )}

      {/* Main Grid: Architecture Info Left, Live Phone Mockup Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5 Cols): Technical Blueprint & Fast Prompts */}
        <div className="lg:col-span-5 space-y-5 text-xs text-left">
          
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[#2D6A4F] bg-[#EBF7EE] px-2 py-0.5 rounded">
              Participant Under Test
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Select Patient:
              </label>
              <select
                value={selectedParticipantId}
                onChange={(e) => setSelectedParticipantId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white font-medium text-xs"
              >
                {participants.filter(p => !p.archived).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currentProgramTitle || 'No program'})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#F0F2EF] space-y-1 text-[11px] text-gray-600">
              <div>• Active Streak: <strong className="text-amber-600">{activeParticipant.streakDays || 0} Days 🔥</strong></div>
              <div>• Current Progress: <strong>Day {activeParticipant.currentDay || 1} of {activeParticipant.totalDays || 21}</strong></div>
              <div>• Program: <strong>{activeParticipant.currentProgramTitle || '21-Day Habit Reset'}</strong></div>
            </div>
          </div>

          {/* Quick Click Prompts */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8EAE7] shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#18231C]">
              Simulate Incoming Patient Replies:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSendMessage('Done! Finished my morning hydration and walk.')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left font-semibold text-[11px] transition-colors"
              >
                "Done!" ✅
                <span className="block text-[10px] text-emerald-600 font-normal">Logs task & streak</span>
              </button>

              <button
                onClick={() => handleSendMessage('Skipped today, had an early flight')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-left font-semibold text-[11px] transition-colors"
              >
                "Skipped" ⏸️
                <span className="block text-[10px] text-amber-600 font-normal">Transparent rest</span>
              </button>

              <button
                onClick={() => handleSendMessage('Need help, feeling severe lower back stiffness')}
                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-left font-semibold text-[11px] transition-colors"
              >
                "Need Help" 🚩
                <span className="block text-[10px] text-rose-600 font-normal">Priority coach alert</span>
              </button>

              <button
                onClick={() => handleSendMessage('Status')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-left font-semibold text-[11px] transition-colors"
              >
                "Status" 📊
                <span className="block text-[10px] text-blue-600 font-normal">Check progress report</span>
              </button>
            </div>
          </div>

          {/* Architecture Box */}
          <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E8EAE7] space-y-1.5 text-[11px] text-[#5C6E63]">
            <div className="font-bold text-[#18231C] flex items-center gap-1.5">
              <IconShield className="w-3.5 h-3.5 text-[#2D6A4F]" />
              Production Meta Cloud API Status:
            </div>
            <p>
              Webhook endpoint: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px]">POST /api/webhook/whatsapp</code>
            </p>
            <p>
              Meta gives <strong>1,000 free service conversations / month</strong>. When ready to connect a real Meta phone number, input your credentials into <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">server/whatsappBotEngine.js</code>.
            </p>
          </div>

        </div>

        {/* Right Column (7 Cols): Ultra-Realistic iPhone WhatsApp Chat Mockup */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-sm rounded-[40px] bg-[#111B21] p-3 shadow-2xl border-4 border-[#2A3942] relative">
            
            {/* Phone Screen Container */}
            <div className="w-full bg-[#0B141A] rounded-[32px] overflow-hidden flex flex-col h-[560px] text-white relative">
              
              {/* WhatsApp Chat Header */}
              <div className="bg-[#202C33] px-3.5 py-3 flex items-center justify-between border-b border-[#2A3942] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                    CL
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#E9EDEF] flex items-center gap-1">
                      <span>Careloop Adherence Bot</span>
                      <svg className="w-3.5 h-3.5 text-[#00A884]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="text-[10px] text-[#8696A0]">
                      Official Coaching Assistant • Online
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#8696A0] text-sm">
                  <span>⋮</span>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0B141A] text-xs">
                
                {/* Date separator pill */}
                <div className="text-center">
                  <span className="bg-[#182229] text-[#8696A0] text-[10px] px-2.5 py-1 rounded-md font-medium">
                    TODAY
                  </span>
                </div>

                {/* Messages list */}
                {messages.map((m) => {
                  const isUser = m.sender === 'user';

                  return (
                    <div 
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed relative ${
                          isUser 
                            ? 'bg-[#005C4B] text-[#E9EDEF] rounded-tr-none' 
                            : 'bg-[#202C33] text-[#D1D7DB] rounded-tl-none border border-[#2A3942]'
                        }`}
                      >
                        {m.text}
                        <div className={`text-[9px] text-right mt-1 flex items-center justify-end gap-1 ${
                          isUser ? 'text-[#8696A0]' : 'text-[#8696A0]'
                        }`}>
                          <span>{m.time}</span>
                          {isUser && <span className="text-[#53BDEB]">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-[#202C33] p-2 rounded-xl w-16 text-[#8696A0] text-[10px] animate-pulse">
                    <span>typing</span>
                    <span className="animate-bounce">...</span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* WhatsApp Message Input Bar */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="bg-[#202C33] p-2 flex items-center gap-2 border-t border-[#2A3942] shrink-0"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type 'Done', 'Skip', or reflection..."
                  className="flex-1 bg-[#2A3942] text-[#E9EDEF] placeholder-[#8696A0] text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00A884]"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] transition-colors disabled:opacity-40 shrink-0"
                >
                  <IconSend className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
