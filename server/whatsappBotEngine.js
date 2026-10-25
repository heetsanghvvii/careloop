/**
 * Careloop WhatsApp Bot Engine
 * 
 * Production-ready parser, triage, and response generator for Meta WhatsApp Cloud API.
 * Works seamlessly both with live Meta Cloud API webhooks and in local simulation mode.
 */

export class WhatsAppBotEngine {
  constructor(options = {}) {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Support aligned META_* and legacy WHATSAPP_* environment variables
    this.verifyToken = options.verifyToken || 
                       process.env.META_VERIFY_TOKEN || 
                       process.env.WHATSAPP_VERIFY_TOKEN || 
                       (isProd ? '' : 'careloop_dev_webhook_verify_token');
                       
    this.appSecret = options.appSecret || 
                     process.env.META_APP_SECRET || 
                     process.env.WHATSAPP_APP_SECRET || '';
                     
    this.apiToken = options.apiToken || 
                    process.env.META_API_TOKEN || 
                    process.env.WHATSAPP_API_TOKEN || '';
                    
    this.phoneNumberId = options.phoneNumberId || 
                         process.env.META_PHONE_NUMBER_ID || 
                         process.env.WHATSAPP_PHONE_NUMBER_ID || '';
                         
    this.isLive = Boolean(this.apiToken && this.phoneNumberId);
  }

  /**
   * Validates Meta Webhook Subscription (GET request from Meta Cloud API)
   */
  verifyWebhook(mode, token, challenge) {
    if (!this.verifyToken) {
      return { verified: false, error: 'Webhook verify token not configured on server' };
    }
    if (mode === 'subscribe' && token === this.verifyToken) {
      return { verified: true, challenge };
    }
    return { verified: false, error: 'Verification token mismatch' };
  }

  /**
   * Validates Meta HMAC SHA-256 Webhook Signature (X-Hub-Signature-256 header)
   */
  async verifyWebhookSignature(rawBody, signatureHeader) {
    if (!this.appSecret) {
      // In development / demo when appSecret is unset, pass with audit warning
      return { verified: true, warning: 'META_APP_SECRET unset; signature verification bypassed in dev mode' };
    }
    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
      return { verified: false, error: 'Missing or malformed X-Hub-Signature-256 header' };
    }
    const signature = signatureHeader.substring(7);
    const cryptoModule = await import(/* @vite-ignore */ 'node:crypto');
    const crypto = cryptoModule.default || cryptoModule;
    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(rawBody)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { verified: false, error: 'Invalid HMAC SHA-256 signature' };
    }
    return { verified: true };
  }

  /**
   * Processes incoming WhatsApp webhook payload from Meta
   */
  async processIncomingMessage(payload, context = {}) {
    try {
      const entry = payload?.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];

      if (!message) {
        return { status: 'ignored', reason: 'No message in payload' };
      }

      const senderPhone = message.from; // e.g. "919876543210"
      const messageId = message.id;
      const messageType = message.type;
      const textBody = (message.text?.body || '').trim();

      // Find participant or use context
      const participant = context.participant || {
        name: change?.contacts?.[0]?.profile?.name || 'Participant',
        phone: senderPhone,
        streakDays: 6,
        currentDay: 13,
        totalDays: 21,
        programTitle: '21-Day Habit & Metabolic Reset'
      };

      // Triage message command
      const response = this.evaluateResponse(textBody, participant);

      // GUARANTEE: Never send real messages when in simulation mode
      let metaSendResult = null;
      if (this.isLive && !context.simulateOnly) {
        metaSendResult = await this.sendWhatsAppMessage(senderPhone, response.replyText);
      } else if (context.simulateOnly) {
        metaSendResult = { simulated: true, note: 'Simulation mode: real Meta dispatch blocked' };
      }

      return {
        status: 'success',
        senderPhone,
        messageId,
        incomingText: textBody,
        actionTaken: response.action,
        taskStatus: response.taskStatus,
        participantUpdate: response.participantUpdate,
        replyText: response.replyText,
        metaSent: Boolean(metaSendResult && !metaSendResult.simulated)
      };
    } catch (err) {
      console.error('Careloop WhatsApp Bot Error:', err);
      return { status: 'error', error: err.message };
    }
  }

  /**
   * Intelligent command evaluation & triage logic
   */
  evaluateResponse(rawText, participant) {
    const text = rawText.toUpperCase().trim();
    const firstName = (participant.name || 'there').split(' ')[0];

    // COMMAND: DONE / COMPLETE / 1 / YES
    if (['DONE', '1', 'COMPLETE', 'COMPLETED', 'YES', 'FINISHED', 'DID IT', 'ALL DONE'].includes(text) || text.startsWith('DONE')) {
      const newStreak = (participant.streakDays || 0) + 1;
      return {
        action: 'TASK_COMPLETED',
        taskStatus: 'completed',
        participantUpdate: {
          streakDays: newStreak,
          lastActivityDate: new Date().toISOString().split('T')[0],
          lastCheckinNote: `Verified via WhatsApp: "${rawText}"`
        },
        replyText: `🌿 Great work, ${firstName}! Your daily tasks for Day ${participant.currentDay || 1} have been logged.\n\n🔥 You are now on a ${newStreak}-day consistency streak!\n\nYour coach has been notified. Keep this momentum going tomorrow.`
      };
    }

    // COMMAND: SKIP / 2 / SKIPPED / PASS
    if (['SKIP', '2', 'SKIPPED', 'NO', 'PASS', 'COULDNT DO IT', 'MISSED'].includes(text) || text.startsWith('SKIP')) {
      return {
        action: 'TASK_SKIPPED',
        taskStatus: 'skipped',
        participantUpdate: {
          lastActivityDate: new Date().toISOString().split('T')[0],
          lastCheckinNote: `Participant skipped via WhatsApp: "${rawText}"`
        },
        replyText: `Got it, ${firstName}. We've transparently logged today as a rest/skip.\n\n💡 Remember: Consistency is about staying connected, not perfection. Resume your normal anchor tasks tomorrow morning without doubling up.`
      };
    }

    // COMMAND: HELP / 3 / NEED HELP / SORE / PAIN / INJURY / QUESTION
    if (['HELP', '3', 'NEED HELP', 'PAIN', 'SORE', 'STIFF', 'INJURY', 'HURTS'].some(kw => text.includes(kw))) {
      return {
        action: 'FLAG_COACH_INTERVENTION',
        taskStatus: 'pending',
        participantUpdate: {
          flaggedAtRisk: true,
          lastCheckinNote: `🚩 High-Priority Flag via WhatsApp: "${rawText}"`
        },
        replyText: `⚠️ Thank you for letting us know, ${firstName}.\n\nYour message has been flagged as a priority for your coach. If you are experiencing discomfort, please pause any strenuous movements. Your coach will review your notes and reach out shortly.`
      };
    }

    // COMMAND: STATUS / PROGRESS / STREAK / 4
    if (['STATUS', 'PROGRESS', '4', 'STREAK', 'SCORE', 'STATS'].includes(text)) {
      return {
        action: 'STATUS_QUERY',
        taskStatus: null,
        participantUpdate: null,
        replyText: `📊 Careloop Status Report for ${participant.name}:\n\n• Program: ${participant.programTitle || 'Active Program'}\n• Day: ${participant.currentDay || 1} of ${participant.totalDays || 21}\n• Current Streak: ${participant.streakDays || 0} consecutive days 🔥\n\nReply "Done" when you finish today's tasks or "Help" if you need guidance!`
      };
    }

    // DEFAULT / FREEFORM REFLECTION NOTE
    return {
      action: 'LOG_REFLECTION_NOTE',
      taskStatus: 'completed',
      participantUpdate: {
        lastActivityDate: new Date().toISOString().split('T')[0],
        lastCheckinNote: `WhatsApp Reflection: "${rawText}"`
      },
      replyText: `📝 Thanks for sharing your check-in, ${firstName}!\n\nYour reflection has been recorded on your coach's dashboard: "${rawText}"\n\nReply "Status" anytime to check your progress streak.`
    };
  }

  /**
   * Generates a frictionless Click-to-WhatsApp link for real native phones
   */
  generateClickToWhatsAppLink(coachPhoneNumber, participantName, programTitle, dayNumber, tasks = []) {
    const cleanPhone = coachPhoneNumber.replace(/[^0-9]/g, '');
    const taskSummary = tasks.map(t => `• ${t.title || t}`).join('\n');
    
    const message = 
      `Careloop Check-in | ${participantName}\n` +
      `Program: ${programTitle} (Day ${dayNumber})\n\n` +
      `Today's Action Log:\n${taskSummary || '• Daily anchor tasks completed'}\n\n` +
      `Notes: `;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }

  /**
   * Send WhatsApp message via Meta Cloud API (when live credentials provided)
   */
  async sendWhatsAppMessage(toPhone, messageText) {
    if (!this.isLive) {
      console.log(`[WhatsApp Sandbox] Simulated outgoing message to ${toPhone}:\n${messageText}`);
      return { simulated: true };
    }

    const endpoint = `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toPhone.replace(/[^0-9]/g, ''),
      type: 'text',
      text: { body: messageText }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }
}
