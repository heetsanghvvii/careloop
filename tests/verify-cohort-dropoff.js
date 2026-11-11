import assert from 'node:assert';
import { computeDropOff, firstDropOffDay } from '../src/utils/cohortDropOff.js';

const participants = [
  { id: 'a', startDate: '2026-01-01' },
  { id: 'b', startDate: '2026-01-01' },
  { id: 'c', startDate: '2026-01-03' },
  { id: 'z', startDate: '2026-01-01', archived: true },
];
const completions = [
  { participantId: 'a', date: '2026-01-01', status: 'completed' },
  { participantId: 'b', date: '2026-01-01', status: 'skipped' },
  { participantId: 'a', date: '2026-01-02', status: 'completed' },
  { participantId: 'b', date: '2026-01-02', status: 'pending' },
  { participantId: 'z', date: '2026-01-01', status: 'completed' },
];
const rows = computeDropOff({ participants, completions, today: '2026-01-03', maxDays: 3 });
assert.deepStrictEqual(rows[0], { day: 1, base: 3, active: 2, rate: 67 }); // c day1 = Jan 3, no record
assert.deepStrictEqual(rows[1], { day: 2, base: 2, active: 1, rate: 50 }); // pending does not count; c not yet at day 2
assert.deepStrictEqual(rows[2], { day: 3, base: 2, active: 0, rate: 0 }); // a,b reach day 3 today, no record
assert.strictEqual(firstDropOffDay(rows, 60), 2);
assert.strictEqual(firstDropOffDay(rows, 10), 3);
assert.strictEqual(firstDropOffDay(rows.slice(0, 2), 10), null);
console.log('✅ Cohort drop-off tests passed (6/6)');
