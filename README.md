# CARELOOP (MVP)
> **Better follow-through. Measurable progress.**

Careloop is a configurable health-program management SaaS platform built for coaches, personal trainers, dietitians, physiotherapists, wellness mentors, and clinical advisors to assign daily health actions, verify client follow-through, and intervene before drop-off occurs.

---

## 🌟 Core Loop

$$\text{Create Program} \longrightarrow \text{Assign Actions} \longrightarrow \text{Track Completion} \longrightarrow \text{Review Progress} \longrightarrow \text{Follow Up}$$

---

## 🚀 Key Features Built & Ready

### 1. Official Marketing Website & Lead Capture
- **Editorial SaaS Design**: Warm cream background (`#FBFBFA`), deep forest-green accents (`#1B4332`, `#2D6A4F`), and soft sage tags (`#EBF7EE`, `#52B788`).
- **Comprehensive Structure (Sections A–L)**:
  - **Hero**: Balanced desktop split layout with copy and live interactive product mockup preview (toggling Coach and Client views).
  - **The Problem**: 3 relatable challenges (lost plans across messaging apps, lack of follow-through visibility, manual follow-up fatigue).
  - **How Careloop Works**: 4-step sequence (Create → Assign → Track → Improve) with interactive stepper.
  - **Product Showcase**: 6 interactive interface previews with live Careloop styling (Practitioner Dashboard, Directory, Program Builder, Daily Checklist, Progress, Analytics).
  - **Who It's For**: 4 dedicated practice categories (Fitness Creators, Personal Trainers, Dietitians, Rehab Professionals).
  - **Benefits**: Clarity, Visibility, Consistency, Scalability.
  - **Automation Vision**: Transparent roadmap (WhatsApp follow-ups, smart timing, automated response triage, AI protocols).
  - **Pricing**: Transparent validation ladder (Starter ₹499/mo, Growth ₹1,499/mo, Scale ₹2,999/mo) and modular roadmap add-ons.
  - **FAQ**: 8 honest, accordion-powered answers reflecting the current web app capabilities.
  - **Early Access Modal**: Fully validating form capturing name, email, specialty, client volume, and program description, securely persisted via `dataService.submitEarlyAccess`.
  - **Policy Drafts**: Working draft Privacy Policy and Terms of Service modals.
  - **Seamless App Switching**: Instant 1-click toggle between the marketing website and the live practitioner dashboard / participant portal without losing state.

### 2. Public Landing Page & Sandbox Demo
- High-converting SaaS landing page explaining who Careloop is for, the core loop, transparent pricing tiers, and trust statements.
- **1-Click Sandbox Demo**: Visitors can explore a fully populated workspace (Dr. Arjun Patel, *PeakForm Performance*) with realistic synthetic data without needing to sign up first.

### 2. Practitioner Workspace Dashboard
- **Live Computed Metrics**: Active participants, active programs, overall completion percentage, and at-risk participants needing follow-up.
- **Inactivity & Risk Detection Rule**: Automatically flags any participant whose adherence falls below 60% or who has been inactive for $\ge 3\text{ days}$.
- **Recent Activity Feed**: Real-time stream of participant check-in notes and completion timestamps.

### 3. Participant Management & Plan Capacity Limits
- Filter by status (*Active*, *Needs Attention / At Risk*, *Completed*), category, or keyword search.
- **Strict Plan Limit Enforcement**: Adding active participants checks against the workspace plan (Starter: 25, Growth: 100, Scale: 300). If the cap is reached, enrollment is blocked with a prompt to upgrade.
- **Participant Detail Modal**: Historical check-in logs, adherence score, active streak, and program re-assignment.

### 4. Program Builder & Evidence-Based Template Library
- Create and edit custom curriculums with title, category, duration, guidelines, and daily task sequences.
- **4 Pre-built Evidence-Based Templates Ready to Clone**:
  1. *21-Day Habit & Metabolic Reset* (Circadian hydration, sunlight walk, protein anchor meal, digital sunset)
  2. *6-Week Strength & Functional Mobility* (Dynamic joint flow, resistance training split, NEAT steps, down-regulation breathwork)
  3. *Mediterranean Anti-Inflammatory Protocol* (Plant diversity 3+/meal, Omega-3 fatty fish, 2.5L hydration, mindful eating)
  4. *Lumbar Spine & Core Rehabilitation* (McGill Big 3, glute activation, midday micro-breaks, psoas decompression)
- 1-Click Duplicate, Archive, and Assign to enrolled participants.

### 5. Participant Mobile Experience (`ParticipantPortal.jsx`)
- Dedicated client-facing view with daily task checklist (Mark Complete, Mark Skipped, Pending).
- Check-in reflection note input for logging subjective feedback (e.g. energy levels, soreness, weights).
- Real-time recalculation of personal streaks and completion rates.
- *Anti-Guilt Philosophy*: Missing data is never treated as proof of failure; skips are transparently documented as natural lifestyle variance.

### 6. Progress Analytics & CSV Export
- Dynamic 7-day daily adherence trend chart.
- Leaderboard ranking participants from highest adherence to those needing intervention.
- **1-Click Browser CSV Export**: Exports participant names, emails, categories, programs, completion percentages, streaks, and practitioner notes directly to `.csv`.

### 7. Interactive Reminder Simulator
- High-fidelity preview of future SMS and WhatsApp accountability sequences.
- Queue scheduled reminders (Morning prompt, evening wind-down, workout nudge).
- **Interactive Simulated Responses**: Click *"Done"*, *"Skipped"*, or *"Need help"* to simulate incoming participant replies and observe real-time task updates and coach alerts.
- *Zero-Billing Integrity*: No paid SMS/WhatsApp delivery gateways are triggered.

### 8. Hypothesized Pricing Ladder & Plan Switcher
- **Starter**: ₹499/month (up to 25 active participants).
- **Growth**: ₹1,499/month (up to 100 active participants).
- **Scale**: ₹2,999/month (up to 300 active participants).
- Interactive 1-click plan switcher to test capacity limits in the sandbox.
- Disabled previews of future modular add-ons (WhatsApp automation, Gemini AI coaching assistant, wearable integrations, white-label branding, team permissions).

### 9. Two-Way WhatsApp Bot Engine & Clinic QR Stand
- **Native Click-to-WhatsApp Flow**: Generates instant `wa.me` links with structured check-in payloads (Zero App Store barrier).
- **Node.js Webhook Engine (`server/whatsappBotEngine.js`)**: Real-time parser for incoming participant keywords (`DONE`, `SKIP`, `HELP`, `STATUS`) with automated reflection logging.
- **Interactive WhatsApp Lab (`WhatsAppLab.jsx`)**: Live iPhone WhatsApp simulator inside practitioner dashboard for real-time demonstration.
- **Printable Clinic Desk QR Stand (`ClinicQrModal.jsx`)**: Printable prescription desk card for doctor consultation desks.

### 10. 3-in-1 Pitch Deck (`PitchDeck.jsx`)
- **🏥 For Doctors & Dietitians**: Focus on patient adherence, zero-friction WhatsApp integration, and higher renewal rates.
- **📈 For Seed Investors**: ₹1,800 Cr Indian wellness TAM, negative net churn unit economics (LTV/CAC 6.8x, ₹499–₹2,999/mo), ₹0 initial infrastructure spend.
- **🚀 For Potential Team**: Mission, 24-month roadmap, technical architecture, and culture.
- Full institutional-grade document persisted in `CARELOOP_MASTER_BUSINESS_PLAN_AND_3_PITCH_DECKS.md`.

---

## 🔒 Security & Data Isolation (`firestore.rules`)

A complete set of production-tested, multi-tenant Firestore Security Rules is included in `firestore.rules`:
- Unauthenticated users cannot read private workspace records.
- Cross-tenant isolation: One practitioner cannot access another practitioner's programs or participants.
- Participant identity scoping: Participants can only read programs and write task completions assigned to their verified email/UID.
- Role elevation protection: Participants cannot promote themselves to practitioner or modify subscription plans.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (Warm off-white/cream `#FBFBFA` with forest green accents `#1B4332`, `#2D6A4F`)
- **Icons**: Custom accessible SVG component library (zero bundle bloat)
- **Database & Auth**:
  - Live Firebase Cloud Firestore & Google Identity Authentication support (`src/firebase/config.js`).
  - Unified Data Layer (`src/firebase/dataService.js`) with automatic fallback to persistent browser sandbox, enabling 100% offline functionality.

### 9. Two-Way WhatsApp Bot Engine & Clinic QR Stand
- **Native Click-to-WhatsApp Flow**: Generates instant `wa.me` links with structured check-in payloads (Zero App Store barrier).
- **Node.js Webhook Engine (`server/whatsappBotEngine.js`)**: Real-time parser for incoming participant keywords (`DONE`, `SKIP`, `HELP`, `STATUS`) with automated reflection logging.
- **Interactive WhatsApp Lab (`WhatsAppLab.jsx`)**: Live iPhone WhatsApp simulator inside practitioner dashboard for real-time demonstration.
- **Printable Clinic Desk QR Stand (`ClinicQrModal.jsx`)**: Printable prescription desk card for doctor consultation desks.

### 10. 3-in-1 Pitch Deck (`PitchDeck.jsx`)
- **🏥 For Doctors & Dietitians**: Focus on patient adherence, zero-friction WhatsApp integration, and higher renewal rates.
- **📈 For Seed Investors**: ₹1,800 Cr Indian wellness TAM, negative net churn unit economics (LTV/CAC 6.8x, ₹499–₹2,999/mo), ₹0 initial infrastructure spend.
- **🚀 For Potential Team**: Mission, 24-month roadmap, technical architecture, and culture.
- Full institutional-grade document persisted in `CARELOOP_MASTER_BUSINESS_PLAN_AND_3_PITCH_DECKS.md`.

---

## 💻 Running Locally / In Browser Preview

Start the Vite development preview server:
```bash
npm run dev
```
Preview production build:
```bash
npm run build
npm run preview
```
Run comprehensive test verification suite:
```bash
node ./tests/verify-careloop.js
```
