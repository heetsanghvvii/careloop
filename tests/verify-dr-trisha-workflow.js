import assert from 'node:assert';
import { dataService } from '../src/firebase/dataService.js';
import { WhatsAppBotEngine } from '../server/whatsappBotEngine.js';
import { getIsoDateOffset } from '../src/data/initialDemoData.js';

console.log('🩺 Starting End-to-End Clinical Workflow Test for Dr. Trisha...');

// --- STEP 1: PRACTITIONER ONBOARDING & WORKSPACE INITIALIZATION ---
console.log('\n[Phase 1] Initializing Workspace for Dr. Trisha...');
const trishaWorkspace = await dataService.updateWorkspace('ws_demo_001', {
  name: "Dr. Trisha's Nutrition & Metabolic Clinic",
  practitionerName: 'Dr. Trisha Sen',
  practitionerEmail: 'dr.trisha@careloop.health',
  category: 'Clinical Dietetics & Hormonal Health',
  plan: 'Growth' // Up to 100 active patients
});

assert.strictEqual(trishaWorkspace.practitionerName, 'Dr. Trisha Sen');
assert.strictEqual(trishaWorkspace.plan, 'Growth');
console.log('✅ Workspace configured for:', trishaWorkspace.name);

// --- STEP 2: CREATING SPECIALIZED CLINICAL PROTOCOL ---
console.log('\n[Phase 2] Creating PCOS & Metabolic Reset Protocol...');
const pcosProgram = await dataService.createProgram('ws_demo_001', {
  title: 'PCOS & Insulin Resistance 21-Day Protocol',
  category: 'Hormonal Balance',
  durationDays: 21,
  description: 'Evidence-based dietary and habit protocol targeting postprandial glucose stabilization and androgen reduction.',
  guidelines: 'Prioritize protein at breakfast. Walk 15 mins after major meals. Avoid liquid sugars.',
  tasks: [
    {
      id: 'task_pcos_1',
      title: 'Warm Lemon-Fenugreek Water',
      category: 'Hydration',
      frequency: 'Daily (Morning)',
      description: '500ml warm water with soaked fenugreek seeds for glucose moderation.',
      targetMetric: '500ml'
    },
    {
      id: 'task_pcos_2',
      title: '30g Protein Anchor Meal',
      category: 'Nutrition',
      frequency: 'Daily (Breakfast)',
      description: 'Eggs, paneer, tofu, or sprouts to prevent 11 AM insulin spikes.',
      targetMetric: '30g'
    },
    {
      id: 'task_pcos_3',
      title: '20-min Post-Lunch Brisk Walk',
      category: 'Movement',
      frequency: 'Daily (Afternoon)',
      description: 'Muscle contraction-driven GLUT4 glucose uptake.',
      targetMetric: '20 mins'
    },
    {
      id: 'task_pcos_4',
      title: 'Spearmint Tea & Digital Sunset',
      category: 'Recovery',
      frequency: 'Daily (Evening)',
      description: 'Anti-androgenic spearmint tea + screens off 45 mins before sleep.',
      targetMetric: '1 cup'
    }
  ]
});

assert.ok(pcosProgram.id, 'Program must have an ID');
assert.strictEqual(pcosProgram.tasks.length, 4, 'Must have 4 clinical tasks');
console.log('✅ Program created:', pcosProgram.title);

// --- STEP 3: ENROLLING PATIENT (ANANYA RAO) ---
console.log('\n[Phase 3] Enrolling Patient: Ananya Rao...');
const ananya = await dataService.addParticipant('ws_demo_001', {
  name: 'Ananya Rao',
  email: 'ananya.rao@example.com',
  phone: '+91 98765 11223',
  category: 'Hormonal Balance',
  currentProgramId: pcosProgram.id,
  currentProgramTitle: pcosProgram.title,
  notes: 'Referred for irregular cycles, elevated fasting insulin, and afternoon fatigue.'
});

assert.ok(ananya.id, 'Patient must receive a unique ID');
assert.strictEqual(ananya.name, 'Ananya Rao');
console.log(`✅ Enrolled ${ananya.name} under Dr. Trisha's workspace.`);

// --- STEP 4: PATIENT LOGGING CHECK-IN ON MOBILE PORTAL ---
console.log('\n[Phase 4] Simulating Patient Daily Check-in...');
const today = getIsoDateOffset(0);

// Ananya completes Task 1, 2, 3 and skips Task 4
await dataService.recordTaskCompletion('ws_demo_001', ananya.id, 'task_pcos_1', today, 'completed', 'Drank 500ml fenugreek water');
await dataService.recordTaskCompletion('ws_demo_001', ananya.id, 'task_pcos_2', today, 'completed', 'Sprouts & 2 boiled eggs');
await dataService.recordTaskCompletion('ws_demo_001', ananya.id, 'task_pcos_3', today, 'completed', '2,400 steps around office block');
await dataService.recordTaskCompletion('ws_demo_001', ananya.id, 'task_pcos_4', today, 'skipped', 'Worked late, missed evening spearmint tea');

const ananyaCompletions = await dataService.getCompletions('ws_demo_001', ananya.id);
assert.strictEqual(ananyaCompletions.length, 4, 'Must have 4 completion entries');

const updatedAnanya = (await dataService.getParticipants('ws_demo_001')).find(p => p.id === ananya.id);
// 3 completed out of 4 recorded = 75% adherence
assert.strictEqual(updatedAnanya.completionRate, 75, 'Adherence should be 75%');
console.log(`✅ Check-in recorded. Ananya's Adherence Rate: ${updatedAnanya.completionRate}%`);

// --- STEP 5: TWO-WAY WHATSAPP INTERACTION & RISK TRIAGE ---
console.log('\n[Phase 5] Testing WhatsApp Flow with Dr. Trisha...');
const botEngine = new WhatsAppBotEngine();

// A. Click-to-WhatsApp Native Deep Link
const deepLink = botEngine.generateClickToWhatsAppLink(
  '+91 98765 00000',
  ananya.name,
  pcosProgram.title,
  1,
  pcosProgram.tasks
);
assert.ok(deepLink.startsWith('https://wa.me/919876500000'), 'Deep link should point to wa.me');
console.log('✅ Generated native Click-to-WhatsApp link for Ananya');

// B. Ananya sends "DONE" via WhatsApp
const doneReply = await botEngine.processIncomingMessage({
  entry: [{
    changes: [{
      value: {
        contacts: [{ profile: { name: ananya.name } }],
        messages: [{
          from: '919876511223',
          id: 'wamid.test_01',
          type: 'text',
          text: { body: 'DONE with morning walk and protein breakfast' }
        }]
      }
    }]
  }],
}, { participant: updatedAnanya });

assert.strictEqual(doneReply.actionTaken, 'TASK_COMPLETED');
assert.ok(doneReply.replyText.includes('Ananya'), 'Reply should personalize with Ananya');
console.log('✅ WhatsApp "DONE" check-in handled. Bot replied:\n', doneReply.replyText);

// C. Ananya sends "HELP feeling dizzy after medication"
const helpReply = await botEngine.processIncomingMessage({
  entry: [{
    changes: [{
      value: {
        contacts: [{ profile: { name: ananya.name } }],
        messages: [{
          from: '919876511223',
          id: 'wamid.test_02',
          type: 'text',
          text: { body: 'HELP feeling dizzy and nauseous after dinner' }
        }]
      }
    }]
  }],
}, { participant: updatedAnanya });

assert.strictEqual(helpReply.actionTaken, 'FLAG_COACH_INTERVENTION');
assert.strictEqual(helpReply.participantUpdate.flaggedAtRisk, true);
console.log('✅ WhatsApp "HELP" triage detected alert. Doctor intervention triggered!');

// Apply the risk flag to Ananya in Dr. Trisha's database
await dataService.updateParticipant('ws_demo_001', ananya.id, {
  lastCheckinNote: helpReply.participantUpdate.lastCheckinNote,
  flaggedAtRisk: true
});

// --- STEP 6: DR. TRISHA'S CLINICAL DASHBOARD AUDIT ---
console.log('\n[Phase 6] Auditing Dr. Trisha\'s Live Dashboard State...');
const allParticipants = await dataService.getParticipants('ws_demo_001');
const atRiskCohort = allParticipants.filter(p => p.flaggedAtRisk || p.completionRate < 60);

assert.ok(atRiskCohort.some(p => p.id === ananya.id), 'Ananya must appear in Dr. Trisha at-risk cohort');
console.log(`✅ Dr. Trisha's Dashboard verified: Total Clients: ${allParticipants.length}, At-Risk Flagged: ${atRiskCohort.length}`);

console.log('\n🎉 ALL 6 WORKFLOW PHASES FOR DR. TRISHA PASSED WITH 100% SUCCESS!\n');
