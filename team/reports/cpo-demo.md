# CPO report: Project Vial demo screens

Status: built and driven end to end in a real browser. Synthetic data, mock provider only. Nothing committed, pushed or deployed. `npm run build` and `npm run test:all` both exit 0.

## Built
- src/components/practitioner/LabTests.jsx: doctor tab. Pick participant, tick catalog tests, optional due date and note, create order. Order list with status. Open an order: values with unit and reference range, "Release to patient" with optional note, cancel order, and a labelled "Demo: simulate lab" box (Sample collected, Report ready, Collection failed) that calls applyProviderEvent. Buttons enable only in the valid status.
- src/components/participant/LabTestsSection.jsx: patient "Lab tests" section inside ParticipantPortal. Pincode check, date and slot, placeholder consent text plus "Draft consent, not legally reviewed.", consent checkbox, book. Status shown after. Values, unit, reference range and the doctor's release note appear only once released.
- src/components/vial/: vialService.js (singleton service, createLocalStorageStore with its own key careloop_vial_diagnostics_v1, mock provider), VialBanner.jsx (synthetic banner on every Vial screen), ReportTable.jsx (no colours, flags or interpretation).
- Wiring: src/App.jsx (import, 'labs' tab, URL whitelist), src/components/design/WorkspaceNav.jsx (the nav App actually renders; one tab added), src/components/Navbar.jsx (tab added, but that file is not what App renders), ParticipantPortal.jsx (one line).
- Role mapping: app role 'practitioner' acts as service role 'doctor'; participant acts as 'patient'. Only the doctor screen can create orders.

## Open each screen
- Doctor: http://localhost:3000/?view=dashboard&tab=labs (or the "Lab Tests" tab).
- Patient: http://localhost:3000/?view=participant (Sarah Chen, section "Lab tests").

## Screenshots (team/demo/, deviceScaleFactor 2, from the running app)
01_doctor_create_order.png, 02_patient_book.png, 03_doctor_review_pending.png, 04_patient_before_release.png, 05_patient_after_release.png, 06_patient_mobile_390.png, 07_doctor_mobile_390.png. Script: scripts/capture-vial-demo.js (needs dev server on 3000).

## Flow results (all passed, text asserted before each capture)
1. Doctor creates order (HbA1c, Lipid Profile for Sarah Chen): pass.
2. Patient books (pincode 560001, Bengaluru, slot, consent): pass.
3. Simulate collected, then report ready: pass; doctor sees values, release box.
4. Patient before release: pass; asserted "Reference range", "mg/dL", "Hemoglobin" absent.
5. Doctor releases with note; patient sees values, ranges and note: pass.
6. 390px: no horizontal page scroll on either screen (measured). The existing practitioner nav row scrolls inside itself on mobile; that is the existing nav, not Vial.
Not tested: collection failed and cancel buttons in browser, non-serviceable pincode, other browsers, real devices, accessibility tooling.

## Top 5 product gaps
1. Consent text is a placeholder; counsel must supply real text and the flow needs an audit trail.
2. No patient or doctor notifications (WhatsApp, email) when an order, report or release happens; patient polls every 2 s in demo.
3. Orders only live in browser localStorage; no Firestore store, no multi-device or multi-user sync.
4. Doctor and patient pick from a 5-test mock catalog; panels, fasting prep instructions and real reference ranges are missing.
5. Patient has no cancel or reschedule, no failed-collection rebook path (doctor must create a new order), and no PDF report.

## Bugs / issues in src/diagnostics (not changed)
- Mock provider holds bookings in memory only. After a page reload, cancelOrder on a booked order fails with PROVIDER_CANCEL_REFUSED (unknown_booking), and provider.buildEvent('report_ready') throws "unknown booking". The demo works around this by building events from the stored booking id with generateMockReport; cancel on a booked order after reload remains affected.
- store.js header comment says the localStorage store shares key careloop_local_data_v1 with dataService; I used a separate key to avoid a possible overwrite. Not verified whether dataService would drop the extra maps.
