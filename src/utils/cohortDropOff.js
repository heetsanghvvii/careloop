// Cohort drop-off by program day. A participant "checked in" on program day N
// if they have at least one completed or skipped record on startDate + (N - 1).
// Participants who have not reached day N yet are excluded from that day's base,
// so recent enrollees never look like drop-offs.
const DAY_MS = 86400000;

const toDay = (iso) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);

export function computeDropOff({ participants, completions, today, maxDays = 21 }) {
  const todayDay = toDay(today);
  const rows = [];
  for (let n = 1; n <= maxDays; n++) {
    let base = 0;
    let active = 0;
    for (const p of participants) {
      if (p.archived || !p.startDate) continue;
      const dayIso = toDay(p.startDate) + (n - 1);
      if (dayIso > todayDay) continue;
      base++;
      const hit = completions.some(
        (c) =>
          c.participantId === p.id &&
          toDay(c.date) === dayIso &&
          (c.status === 'completed' || c.status === 'skipped')
      );
      if (hit) active++;
    }
    rows.push({ day: n, base, active, rate: base > 0 ? Math.round((active / base) * 100) : null });
  }
  return rows;
}

// First day where check-in rate falls below `threshold` (default 50) with a real base.
export function firstDropOffDay(rows, threshold = 50) {
  const r = rows.find((x) => x.rate !== null && x.rate < threshold);
  return r ? r.day : null;
}
