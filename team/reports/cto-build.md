# CTO build report: Project Vial diagnostics logic

Status: built and verified at the mock level. `npm run test:all` exit 0 (includes new `test:diagnostics`, 16 test groups, plus 4 new rule tests in verify-firestore-rules-auth.js, now 12 groups of checks). `npm run build` passes. Nothing committed, pushed or deployed. No network calls anywhere.

## Files
- src/diagnostics/: index.js, diagnosticsService.js, mockProvider.js, providerInterface.js, catalog.js, store.js
- server/diagnosticsWebhook.js
- firestore.rules (new blocks), tests/verify-diagnostics.js, tests/verify-firestore-rules-auth.js, package.json

## API (import from `src/diagnostics/index.js`)
All service functions are async and throw `DiagnosticsError` with a `.code`.

```
const svc = createDiagnosticsService({ store?, provider?, clock?, idGen? })
// defaults: in-memory store, mock provider. For demo-mode persistence use createLocalStorageStore().
```
Actor: `{ role: 'doctor'|'patient', uid, workspaceId, participantId? }` (patients need participantId).

- `svc.createOrder({ actor, doctorId, participantId, workspaceId, tests: string[], dueDate?: 'YYYY-MM-DD', doctorNote? }) -> Order`
  Doctor of that workspace only; doctorId must equal actor.uid. Rejects fields recurrence, repeat, retestAfter, autoRetest, suggestedBy, schedule.
- `svc.bookOrder({ actor, orderId, slot: { slotId, date }, pincode, consent: { given: true } }) -> Order`
  Own patient only. Needs consent.given === true, serviceable pincode, slot from `svc.getSlots`.
- `svc.applyProviderEvent(event) -> { applied, duplicate, order }`
  event = `{ eventId, type, providerBookingId, occurredAt?, reason?, report? }`. Idempotent on eventId. Never creates orders.
- `svc.releaseReport({ actor, orderId, releaseNote? }) -> Order` (doctor of workspace; only from reported)
- `svc.cancelOrder({ actor, orderId, reason? }) -> Order` (workspace doctor or own patient; only ordered or booked)
- `svc.getPatientView({ actor, orderId })` and `svc.listPatientOrders({ actor })`
  `{ id, status, statusLabel, tests:[{code,name}], dueDate, doctorNote, booking:{slot,pincode,collection}|null, reportAvailable, results|null, releaseNote|null }`
  `results` is null unless status is released.
- `svc.getDoctorView({ actor, orderId }) -> { order, results|null, pendingReview }`; `svc.listDoctorOrders({ actor, status? }) -> Order[]`
- `svc.checkServiceability(pincode) -> { serviceable, reason?, city? }`; `svc.getSlots(pincode, 'YYYY-MM-DD') -> [{ slotId, date, start, end }]`
- Also exported: `ORDER_STATUS`, `EVENT_TRANSITIONS`, `CONSENT_VERSION`, `TEST_CATALOG` / `listCatalog()` (cbc, hba1c, lipid, tsh, vitd), `createMockProvider`, `createMemoryStore`, `createLocalStorageStore`.

Statuses: ordered, booked, collected, reported (reviewState pending_review), released, cancelled, failed. Cancelled, failed and released are terminal; a retry is a new order a doctor creates explicitly.
Event types: sample_collected (booked to collected), report_ready (collected to reported), collection_failed (booked to failed), booking_cancelled (booked to cancelled).
Error codes the UI may branch on: DOCTOR_ONLY, WORKSPACE_MISMATCH, CONSENT_REQUIRED, NOT_SERVICEABLE, SLOT_UNAVAILABLE, PROVIDER_ERROR, INVALID_TRANSITION, OUT_OF_ORDER, NOT_ORDER_PATIENT, NOT_AUTHORIZED, ORDER_NOT_FOUND, TESTS_REQUIRED, UNKNOWN_TEST, FORBIDDEN_FIELD.

Order shape: `{ id, workspaceId, participantId, doctorId, status, tests, dueDate, doctorNote, origin:'doctor_explicit', createdAt, updatedAt, createdBy, consent:{given,version,givenAt,givenBy}|null, booking:{providerName,providerBookingId,pincode,slot,collection,bookedAt}|null, collectedAt, reportedAt, reviewState, releasedAt, releasedBy, releaseNote, cancelledAt, cancelledBy, cancelReason, failedReason, processedEventIds, history:[{at,from,to,by,reason}] }`.
Result shape (separate collection): `{ orderId, workspaceId, participantId, providerReportId, synthetic, results:[{ testCode, parameters:[{ code, name, value, unit, reference:{low,high,text} }] }], receivedAt }`. The report is whitelisted to these fields, so any flag or interpretation text from a provider is dropped.

Webhook: `handleDiagnosticsWebhook({ rawBody, signatureHeader }, { service, secret?, maxBytes? }) -> { status, body }` and `createDiagnosticsWebhookHandler(options) -> (req, res)`. Statuses: 200 applied or duplicate, 400 bad JSON, 401 bad signature, 404 unknown booking, 409 out of order, 413 over 64KB, 422 bad event, 503 no secret. Secret from `HLTHSTACK_WEBHOOK_SECRET`; no default in any environment (stricter than the WhatsApp engine, which bypasses in dev). It is not mounted on any server.

## Product rules, how enforced
- Only `createOrder` creates orders, and it needs an explicit doctor actor. Tests assert: events for unknown bookings create nothing, a full lifecycle creates exactly one order, no export or source contains suggest, auto-retest, schedule, timer or cron, and no interpretation words appear in module code.
- Patient view never loads results unless released. Results live in a separate collection from the order.
- Consent is stored with a version string `v0-draft-NOT-LEGALLY-REVIEWED`. Counsel must supply real consent text.

## Firestore rules (workspaces/{ws}/diagnosticOrders/{id}, diagnosticResults/{id})
Practitioner creates (must be status ordered, origin doctor_explicit, doctorId own uid) and may only release (reported to released) or cancel (ordered or booked). Participant reads own order only. Results readable by participant only if the linked order is released. Clients never write results; no deletes. Booking and provider updates must be written server side (admin SDK). The Firestore persistence adapter itself is NOT written (only memory and localStorage stores exist).

## Assumptions about hlthstack (all unverified)
1. Only known: `POST /v1/bookings {service:"diagnostics", test:"cbc", pincode:"560001", collection:"home"}` from the marketing site. Everything else is assumed.
2. Panel of several tests: assumed one booking with a tests array (the site shows a single `test`; may need one booking per test).
3. Slot listing, serviceability check, cancel endpoint and idempotency keys exist (assumed).
4. Status and report delivery by webhook with HMAC SHA-256 in header `X-Hlthstack-Signature: sha256=<hex>`; payload mappable to our event shape. Could instead be polling.
5. Reports are structured with value, unit and reference range per parameter. Test codes and reference ranges in the catalog are mock placeholders, not clinical references.
6. Mock coverage is pincode prefixes 560, 400, 110 only.

## Swap-to-real effort (estimate, not measured)
About 4 to 6 engineering days after docs and a sandbox exist: real adapter implementing the 4 provider methods (1 to 2 d), webhook payload and signature mapping plus test-code mapping (1 d), Firestore store adapter and admin-SDK server path for booking and webhook writes (1 to 2 d), retries, failure handling and rule emulator tests (1 d). Blocked until vendor docs, sandbox, and data/consent safeguards are agreed.

## NOT verified
- Real hlthstack behaviour of any kind; no contact made.
- Firestore rules were not run against the real emulator (no JRE); tests use the repo's hand-written evaluator mirror, which could drift from the rules text. The rules syntax itself is unlinted.
- No React or browser run; createLocalStorageStore is untested in a browser (node falls back to memory).
- No concurrency control: two simultaneous writes to one order could race in a real database (needs transactions in Firestore).
- If provider booking succeeds but the store write fails, the booking is orphaned (mock only; real path needs reconciliation).
- Consent text, retention, and health-data compliance are unreviewed.
