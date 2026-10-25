import assert from 'node:assert';
import fs from 'node:fs';
import { dataService } from '../src/firebase/dataService.js';

console.log('🧪 Starting Careloop Official Marketing Website Test Suite...');

// 1. Verify SEO and Metadata in index.html
console.log('\n[Test 1] Verifying SEO Metadata in index.html...');
const indexHtml = fs.readFileSync('./index.html', 'utf8');
assert.ok(indexHtml.includes('Careloop | Better Follow-Through for Health Programs'), 'Must contain official page title');
assert.ok(indexHtml.includes('Manage health programs, daily actions, participant check-ins, and progress in one configurable workspace.'), 'Must contain suggested meta description');
assert.ok(indexHtml.includes('property="og:title"'), 'Must contain Open Graph title tag');
assert.ok(indexHtml.includes('property="og:description"'), 'Must contain Open Graph description tag');
console.log('✅ SEO metadata verified.');

// 2. Verify Early Access Form Submission & Storage
console.log('\n[Test 2] Testing Early Access Form Submission & Persistence...');
// Invalid submission test
await assert.rejects(
  async () => {
    await dataService.submitEarlyAccess({ name: '', email: 'bad' });
  },
  /Please provide your full name/,
  'Should reject empty name'
);

await assert.rejects(
  async () => {
    await dataService.submitEarlyAccess({ name: 'Valid Name', email: 'notanemail' });
  },
  /Please provide a valid email address/,
  'Should reject invalid email'
);

// Valid submission test
const lead = await dataService.submitEarlyAccess({
  name: 'Maya Lin',
  email: 'maya@practice.health',
  category: 'Dietitian & Nutritionist',
  participantVolume: '26-100 active clients',
  programDescription: 'Anti-inflammatory metabolic routine for 40 clients'
});

assert.ok(lead.id, 'Lead should receive a generated ID');
assert.strictEqual(lead.email, 'maya@practice.health');
console.log('✅ Early access form validation & lead capture verified:', lead.name);

// 3. Verify Section IDs in Website Components
console.log('\n[Test 3] Verifying Section Anchors in Website Files...');
const websiteSource = fs.readFileSync('./src/components/website/HowItWorks.jsx', 'utf8') +
                      fs.readFileSync('./src/components/website/ProductShowcase.jsx', 'utf8') +
                      fs.readFileSync('./src/components/website/WhoItsFor.jsx', 'utf8') +
                      fs.readFileSync('./src/components/website/PricingSection.jsx', 'utf8') +
                      fs.readFileSync('./src/components/website/FaqSection.jsx', 'utf8');

assert.ok(websiteSource.includes('id="how-it-works"'), 'Must have id="how-it-works"');
assert.ok(websiteSource.includes('id="product"'), 'Must have id="product"');
assert.ok(websiteSource.includes('id="who-its-for"'), 'Must have id="who-its-for"');
assert.ok(websiteSource.includes('id="pricing"'), 'Must have id="pricing"');
assert.ok(websiteSource.includes('id="faq"'), 'Must have id="faq"');
console.log('✅ All section anchor targets verified for smooth scrolling navigation.');

console.log('\n🎉 ALL MARKETING WEBSITE VERIFICATIONS PASSED!\n');
