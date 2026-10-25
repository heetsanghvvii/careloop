# Careloop practice UI: local review patch

Based on eada803. This patch is a synthetic browser-local prototype, not a production medical system.

## Implemented
- Quiet, responsive practitioner navigation with a labelled workspace menu and visible exit.
- Practice overview with computed counts, a direct follow-up queue and a three-step product walkthrough.
- Gym builder: named client, practitioner-entered exercise names, target sets/reps/kg, client preview and explicit activation.
- A client can log actual kg/reps for each set plus optional session notes. Corrections update the same session log.
- Planned targets are copied into each log and remain separate from actuals. Replacing a session preserves old logs under their original plan ID.
- Builder draft recovers after navigation and refresh.
- Export and scoped deletion for synthetic gym data, with clear descriptions of their limited scope.

## Integration
1. Apply additive `src/components/design/` files.
2. Merge the small App.jsx import/root-class/gym-route changes deliberately. Do not overwrite concurrent functional changes.
3. Merge WorkoutLogger import/insertion into ParticipantPortal.jsx.
4. Navbar.jsx's missing icon import is an overlapping bug fix. Keep only one copy.
5. No package or lockfile changes are required.
6. Run `npm ci`, `npm run build`, and existing tests. Exercise the production bundle in a browser before any separately approved deployment.

## Verified locally
- Production build, existing 7-suite test command and browser interactions pass.
- Sarah's two-set assignment: target 10 reps/0 kg; actuals saved as 10 and 8 reps; refresh persists values.
- Marcus's client view does not render Sarah's workout. This is UI filtering, NOT a security/tenant-isolation proof.
- Invalid empty/zero-set inputs block review; empty actuals block saving.
- Draft restoration, correction, replacement retaining earlier log, JSON export, scoped deletion and website exit pass.
- Database-settings footer button opens the settings modal. No backend was connected.
- Overview and gym checked at 1440, 390 and 320 CSS px. No document overflow at 320/390.

## Important limits and remaining work
- Gym storage is one browser's localStorage, shared between demo roles. It has no authentication, tenant boundary, encryption or backend sync. Never enter real data.
- The workout logger is a first local UI slice: no exercise library, clinician-validated contraindications, scheduling, rest timers, unilateral/assistance conventions, or analytics integration.
- A synthetic client can be previewed using the workspace menu. Real patient onboarding/invitation is not implemented by this patch.
- The walkthrough is not clinical prescribing guidance. Existing generic programme and client forms still need coherent first-run integration and real practitioner validation.
- Export/deletion here cover only the new gym prototype keys, not accounts, programme data or the whole app.
- Browser storage errors/quota recovery and malicious local-data corruption were not tested. This patch is not production-ready.
- Font rendering uses the project's existing external font route. Bundle remains above Vite's 500 kB warning threshold.

## Customer / PM review
The primary doctor job is to assign a clear plan and see what a client actually did. The revision puts that job ahead of marketing, deck and infrastructure tools. The practitioner retains deliberate client confirmation and activation instead of reducing clicks by removing safety checks.

Do not advertise conversion or click savings without a comparable baseline. Observed revised gym flow from overview: open Gym (1 click), choose a client, enter instructions, Review (2), Activate for named client (3). Field interactions are not counted as button clicks. The prior baseline has no gym flow, so no valid percentage improvement can be calculated.

First-run self-service still needs real workspace setup, identity/consent, publishable plan validation, patient invitation, failed check-in recovery and notification preferences. Follow-up cues are operational suggestions, not medical risk scoring. Retention should come from useful continuity, with clear exit, data portability and cancellation, not lock-in.

## Design sources inspected
- https://github.com/pbakaus/impeccable (Apache-2.0)
- https://github.com/Leonxlnx/taste-skill (MIT)
No upstream code, binaries or installer scripts are included in this patch. No remote environment installation is claimed.
