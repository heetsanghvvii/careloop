import assert from 'node:assert';
import { WhatsAppBotEngine } from '../server/whatsappBotEngine.js';

console.log('🧪 Starting Careloop WhatsApp Bot Engine Verification Suite...');

const bot = new WhatsAppBotEngine({ verifyToken: 'careloop_test_token_123' });

// 1. Webhook Verification Test
console.log('\n[Test 1] Testing Meta Webhook Verification...');
const valid = bot.verifyWebhook('subscribe', 'careloop_test_token_123', 'CHALLENGE_CODE_999');
assert.strictEqual(valid.verified, true);
assert.strictEqual(valid.challenge, 'CHALLENGE_CODE_999');

const invalid = bot.verifyWebhook('subscribe', 'wrong_token', 'CHALLENGE_CODE_999');
assert.strictEqual(invalid.verified, false);
console.log('✅ Meta Webhook verification handshake verified.');

// Mock participant
const mockParticipant = {
  name: 'Sarah Chen',
  phone: '919876543210',
  currentDay: 13,
  totalDays: 21,
  streakDays: 6,
  programTitle: '21-Day Habit & Metabolic Reset'
};

const createMockPayload = (text) => ({
  entry: [{
    changes: [{
      value: {
        contacts: [{ profile: { name: 'Sarah Chen' } }],
        messages: [{
          from: '919876543210',
          id: 'wamid.HBgLM...==',
          type: 'text',
          text: { body: text }
        }]
      }
    }]
  }]
});

// 2. Test "DONE" command
console.log('\n[Test 2] Testing "DONE" check-in command...');
const doneRes = await bot.processIncomingMessage(createMockPayload('Done!'), { participant: mockParticipant });
assert.strictEqual(doneRes.actionTaken, 'TASK_COMPLETED');
assert.strictEqual(doneRes.taskStatus, 'completed');
assert.strictEqual(doneRes.participantUpdate.streakDays, 7, 'Streak should increment from 6 to 7');
assert.ok(doneRes.replyText.includes('7-day consistency streak'), 'Reply must celebrate 7-day streak');
console.log('✅ "DONE" execution verified. Reply:\n' + doneRes.replyText.slice(0, 80) + '...');

// 3. Test "SKIP" command
console.log('\n[Test 3] Testing "SKIP" rest-day command...');
const skipRes = await bot.processIncomingMessage(createMockPayload('Skip today, working late'), { participant: mockParticipant });
assert.strictEqual(skipRes.actionTaken, 'TASK_SKIPPED');
assert.strictEqual(skipRes.taskStatus, 'skipped');
assert.ok(skipRes.replyText.includes('Consistency is about staying connected, not perfection'));
console.log('✅ "SKIP" non-punitive response verified.');

// 4. Test "HELP" command
console.log('\n[Test 4] Testing "HELP" intervention flag...');
const helpRes = await bot.processIncomingMessage(createMockPayload('Need help, knee is sore today'), { participant: mockParticipant });
assert.strictEqual(helpRes.actionTaken, 'FLAG_COACH_INTERVENTION');
assert.strictEqual(helpRes.participantUpdate.flaggedAtRisk, true);
assert.ok(helpRes.replyText.includes('flagged as a priority for your coach'));
console.log('✅ "HELP" priority alert triage verified.');

// 5. Test "STATUS" query
console.log('\n[Test 5] Testing "STATUS" report query...');
const statusRes = await bot.processIncomingMessage(createMockPayload('Status'), { participant: mockParticipant });
assert.strictEqual(statusRes.actionTaken, 'STATUS_QUERY');
assert.ok(statusRes.replyText.includes('Day: 13 of 21') || statusRes.replyText.includes('13 of 21'));
assert.ok(statusRes.replyText.includes('6 consecutive days'));
console.log('✅ "STATUS" report query verified.');

// 6. Test Click-to-WhatsApp link generator
console.log('\n[Test 6] Testing Click-to-WhatsApp Native Deep Link...');
const deepLink = bot.generateClickToWhatsAppLink('+91 98765 00000', 'Sarah Chen', '21-Day Reset', 13, ['Hydration', 'Sunlight walk']);
assert.ok(deepLink.startsWith('https://wa.me/919876500000?text='), 'Must be standard wa.me link');
assert.ok(deepLink.includes(encodeURIComponent('Careloop Check-in | Sarah Chen')));
console.log('✅ Native Click-to-WhatsApp deep link verified:', deepLink.slice(0, 60) + '...');

console.log('\n🎉 ALL WHATSAPP BOT ENGINE TESTS PASSED!\n');
