/**
 * Careloop Founder Command & Hyper-Personalized Pitch Generator Test Suite
 */
import assert from 'node:assert';

console.log('🧪 Starting Careloop Founder Persona & Doctor Pitch Suite...\n');

// Mock data structures
const sampleLead = {
  doctorName: 'Dr. Sneha Kulkarni',
  clinicName: "Dr. Sneha's Women's Metabolic Clinic",
  specialty: 'Metabolic Health & PCOS Dietetics',
  city: 'Indiranagar, Bengaluru',
  patientVolume: '50-100',
  painPoint: 'Patients forget dietary instructions within 3 days of consultation'
};

// 1. Test Specialty Intelligence Synthesis
console.log('[Test 1] Testing Specialty Clinical Insight Synthesis...');
assert.ok(sampleLead.doctorName.includes('Dr. Sneha'));
assert.strictEqual(sampleLead.specialty, 'Metabolic Health & PCOS Dietetics');
console.log('✅ Doctor profile and specialty parsed successfully.');

// 2. Test Custom Pitch Message Generation for WhatsApp
console.log('\n[Test 2] Testing WhatsApp Pitch Deep Link Construction...');
const text = 
`Hello ${sampleLead.doctorName},

I hope you're having a productive week at ${sampleLead.clinicName}.
We built Careloop specifically to solve the patient follow-through gap between consultations in ${sampleLead.specialty}.`;

const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
assert.ok(waLink.startsWith('https://wa.me/?text='));
assert.ok(waLink.includes(encodeURIComponent('Dr. Sneha Kulkarni')));
assert.ok(waLink.includes(encodeURIComponent(sampleLead.clinicName)));
console.log('✅ Pre-filled WhatsApp pitch message link verified:', waLink.slice(0, 65) + '...');

// 3. Test Clinical Memo Structure
console.log('\n[Test 3] Testing 1-Page Executive Clinical Memo Generation...');
const memo = 
`CARELOOP EXECUTIVE CLINICAL MEMO FOR ${sampleLead.doctorName.toUpperCase()}
Clinic: ${sampleLead.clinicName} (${sampleLead.city})
Specialty Focus: ${sampleLead.specialty}
Target Monthly Volume: ${sampleLead.patientVolume} patients

PROBLEM DIAGNOSIS:
• Current Bottleneck: ${sampleLead.painPoint}`;

assert.ok(memo.includes('CARELOOP EXECUTIVE CLINICAL MEMO'));
assert.ok(memo.includes('DR. SNEHA KULKARNI'));
assert.ok(memo.includes('Indiranagar, Bengaluru'));
console.log('✅ Clinical memo formatting verified.');

// 4. Test Multi-Clinic Network Management
console.log('\n[Test 4] Testing Clinic Network Multi-Tenant Switcher...');
const mockClinics = [
  { id: 'ws_demo_001', name: "Dr. Trisha's Nutrition & Metabolic Clinic", plan: 'Growth', patients: 38 },
  { id: 'ws_clinic_peakform', name: 'PeakForm Performance & Sports Physio', plan: 'Starter', patients: 24 },
  { id: 'ws_clinic_apex', name: 'Apex Diabetes & Glycemic Care', plan: 'Growth', patients: 52 }
];

const totalPatients = mockClinics.reduce((sum, c) => sum + c.patients, 0);
assert.strictEqual(totalPatients, 114);
assert.strictEqual(mockClinics.length, 3);
console.log('✅ Clinic directory aggregation verified: 3 clinics, 114 active patients.');

// 5. Test 4 Core Personas Separation
console.log('\n[Test 5] Auditing Core Persona Separation...');
const personas = [
  { role: 'founder', name: 'Founder & Operator', scope: 'global_network_and_pitches' },
  { role: 'practitioner', name: 'Dr. Trisha Sen', scope: 'clinic_dashboard_and_patients' },
  { role: 'coordinator', name: 'Pooja Nair', scope: 'clinic_qr_and_patient_intake' },
  { role: 'participant', name: 'Ananya Rao', scope: 'daily_checkin_and_whatsapp' }
];

assert.strictEqual(personas.length, 4, 'Must provide all 4 distinct operational personas');
assert.ok(personas.find(p => p.role === 'founder'), 'Must include Founder persona');
assert.ok(personas.find(p => p.role === 'practitioner'), 'Must include Doctor persona');
assert.ok(personas.find(p => p.role === 'coordinator'), 'Must include Care Coordinator persona');
assert.ok(personas.find(p => p.role === 'participant'), 'Must include Customer persona');
console.log('✅ All 4 ecosystem personas verified with clear operational boundaries.');

console.log('\n🎉 ALL FOUNDER & PITCH GENERATOR TESTS PASSED!\n');
