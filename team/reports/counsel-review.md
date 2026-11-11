# Project Vial: Counsel research memo

Date: 11 November 2026. Author: Counsel (AI agent).

**This is an AI research memo, not legal advice.** A real Indian health-law lawyer must confirm every point before any business decision.

## 0. How to read this memo (limits of the research)

- Budget: about 12 web searches. Every legal claim below carries a URL that appeared in search results.
- **No primary source was opened.** The fetch tool could not reach meity.gov.in, nmc.org.in, mohfw.gov.in or delhimedicalcouncil.org (these hosts are outside the session's allowed network). So all claims rest on search-result summaries of secondary sources (law-firm notes, news, blogs). Where a primary URL exists I give it as "to check", not as a verified source.
- Labels: **[S]** = from a secondary source seen in search. **[I]** = my interpretation. **[M]** = from my memory of the law, not verified this session. **[NF]** = source not found.
- No section numbers are given unless a source showed them. Where I recall one from memory I mark it [M].
- Rules in RULES.md are respected: synthetic data only, clinicians decide, no spend, no outreach.

## Top risks, in order

1. **Margin on tests ordered by the doctor's own platform (Q2).** The profession's ethics rule is aimed at doctors, but the structure (a doctor orders, the doctor's software vendor earns on each order) is untested and may be read as an inducement or a conflict of interest. Highest legal risk to the business model. Uncertain.
2. **Health data handled before DPDP obligations are tested and without a written processor contract (Q1, Q8).** Full obligations start 13 May 2027 [S], but a real patient booking would be handling sensitive data now.
3. **Product that lets non-doctors order or interpret tests, including the WhatsApp coach (Q3, Q5).**
4. **Report errors and vendor dependence (hlthstack, labs): liability, sample integrity, who signs the report (Q6, Q8).**
5. **Software-as-medical-device drift if the product starts flagging or scoring values (Q5).**

---

## 1. DPDP Act 2023 and DPDP Rules 2025: status and duties

### 1.1 Status as of 11 November 2026

- The Rules were notified in November 2025. Sources give 13 or 14 November 2025; one cites the Gazette on 13 November (G.S.R. 846(E)). [S] https://www.legal500.com/firms/237811-saga-legal/c-india/news-and-developments/the-privacy-timer-starts-now-analysing-the-dpdp-rules-and-its-18-month-countdown , https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/ , https://www.theweek.in/wire-updates/business/2025/11/14/del148-biz-dpdp-rules-ld-govt.html
- Phasing reported by secondary sources [S]: Rules 1, 2 and 17 to 21 immediately (Board and institutional rules); Rule 4 (consent managers) after one year, about 13 November 2026, though one source says a later notification may fix the date; Rules 3, 5 to 16, 22 and 23 after 18 months, reported as **13 May 2027**. Sources: same as above plus https://www.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025-notified
- [I] So today the core fiduciary duties (notice, security, breach, erasure, children, cross-border) are probably **not yet enforceable**, but they start in about six months, which is within the likely life of this product. Build to them now.
- Not verified: whether any extension, amendment or change to the dates happened after the sources I saw. Check MeitY (https://www.meity.gov.in) and the Gazette.

### 1.2 Is health data special?

- [M, not verified] The Act does not create a "sensitive personal data" or "health data" category; it covers digital personal data generally. The old SPDI Rules under the IT Act treated health as sensitive; what remains of them after the DPDP commencement is something to confirm. [NF] for a source this session.
- [I] Practical consequence: no extra statutory consent tier for health, but the sensitivity raises the bar on security, on proportionality of the notice, and on harm if breached. Other law still applies (medical confidentiality duties of doctors; the Telemedicine Guidelines on records; ABDM health data policy if you integrate).

### 1.3 Roles

All of this is [I], based on how the Act defines a fiduciary (who decides purpose and means) and a processor [M].

| Party | Likely role | Why |
|---|---|---|
| Clinic / doctor | Data fiduciary for the clinical relationship, the plan and the test order | Decides purpose and means of the care |
| Careloop | **Processor for the clinic's plan data; probably an independent fiduciary for its own purposes** (booking, billing, margin accounting, product analytics, WhatsApp coaching) | Earning a margin and running the booking flow means Careloop decides some purposes itself |
| hlthstack / Aayuv / ekincare | Probably an independent fiduciary for fulfilment (they decide logistics, lab routing, their own records) and a processor where they act only on Careloop's instructions. Needs contract clarity. | Aggregator with its own lab network |
| Lab | Independent fiduciary for the specimen and report (it has its own legal record duties) | Clinical establishment obligations [M] |

Consequence [I]: you will need a contract that states, for each data flow, who is fiduciary and who is processor. The Act expects a fiduciary to bind its processor by contract [M, section not verified].

### 1.4 Duties summary (all from secondary sources unless marked)

| Topic | What sources say | Source |
|---|---|---|
| Consent notice | Notice before or with consent, in clear language; content per Rules (itemised data, purpose, how to withdraw, how to complain to the Board). Exact content list: not verified. | https://www.dsci.in/files/content/knowledge-centre/2025/Insight-Brief-on-DPDP-Rules.pdf |
| Withdrawal | Must be as easy as giving consent; consent managers can be used for it. | https://www.legal500.com/firms/237811-saga-legal/c-india/news-and-developments/the-privacy-timer-starts-now-analysing-the-dpdp-rules-and-its-18-month-countdown |
| Children | Verifiable parental consent for a child's data. Rules reportedly exempt healthcare providers for defined purposes only. The Act defines a child as under 18 [M]. | https://lawrbit.com/article/digital-personal-data-protection-rules-2025 |
| Breach | Notify affected individuals and the Data Protection Board. 72 hours to the Board is reported by some sources and not others: **uncertain**. | https://www.mondaq.com/india/data-protection/1708268/legal-analysis-of-digital-personal-data-protection-rules-2025 |
| Retention and erasure | Erase when the purpose is met unless law requires retention; one-year retention of certain logs is reported. | https://www.dpdpa.com/dpdparules/rule7.html (secondary site; check) |
| Cross-border | Negative-list model: transfers allowed unless a country is restricted; no restricted list found as of mid-2026; sectoral localisation rules still prevail. Applies from 13 May 2027. | https://www.barandbench.com/columns/the-dpdp-cross-border-transfer-rules-arent-live-yet-so-why-are-contracts-being-redrafted-as-if-they-are , https://ksandk.com/data-protection-and-data-privacy/cross-border-data-transfers-dpdp-act-india/ |
| Grievance officer | The Act requires a contact point and a grievance process for fiduciaries [M]; the DSCI brief lists grievance redressal among rights. Whether a named officer is required for a small fiduciary: not verified. | https://www.dsci.in/files/content/knowledge-centre/2025/Insight-Brief-on-DPDP-Rules.pdf |

Retention note [I]: medical records have their own retention expectations in medical ethics rules (I recall a multi-year period in the 2002 regulations [M]) which may conflict with a patient's erasure request. Lawyer to confirm which prevails and how to split clinic records from Careloop's own copy.

Cloud hosting note: confirm where Careloop and hlthstack store data (India or abroad) before the cross-border start date.

Primary sources to check: https://www.meity.gov.in (Act and Rules), India Code https://www.indiacode.nic.in.

---

## 2. Doctor or platform margin on tests (highest-risk question)

### 2.1 What the rules say

- The Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, 2002 are the operative code if the 2023 NMC regulations remain in abeyance (see 2.2). Clause 6.4.1 is quoted in secondary sources as barring a physician from giving, soliciting or receiving any gift, gratuity, commission or bonus in return for referring, recommending or procuring a patient for treatment. A law-firm article gives wording that also covers referring a person, specimen or material for diagnostic studies. [S, wording not verified against the official text] https://www.mondaq.com/india/healthcare/1173338/inducements-by-medical-practitionersthe-why-not , https://future.indiankanoon.org/doc/100527417/ . Official text to check: https://www.nmc.org.in/rules-regulations/code-of-medical-ethics-regulations-2002/ (consolidated copy: https://www.delhimedicalcouncil.org/pdf/EthicsRegulations-2002.pdf).
- [M] The 2002 regulations also contain a ban on a doctor charging a "fee split" and on rebates, and require charges to be fair; I could not source this. [NF]
- The 2002 regulations were amended up to October 2016 [S] and remain effective per one legal commentary after the 2019 NMC Act [S]. https://www.mondaq.com/india/healthcare/1173338/inducements-by-medical-practitionersthe-why-not

### 2.2 The 2023 NMC regulations

- The NMC Registered Medical Practitioner (Professional Conduct) Regulations 2023 were notified in August 2023, then held in abeyance by a notification of 23 August 2023, which re-adopted the 2002 regulations. [S] https://medicaldialogues.in/health-news/nmc/breaking-news-nmc-puts-its-controversial-registered-medical-practitioner-professional-conduct-regulations-2023-put-on-hold-116314 and https://legalitysimplified.com/?p=36875 . NMC page (not opened): https://www.nmc.org.in/rules-regulations/national-medical-commission-registered-medical-practitioner-professional-conduct-regulations-2023-reg/
- I saw coverage that the 2023 text and the earlier 2022 draft target fee-splitting, commissions and procuring patients online. [S] https://medicaldialogues.in/news/health/doctors/nmc-orders-crackdown-on-referral-fee-commissions-and-online-procurement-of-patients-94297 . Final wording: not verified.
- **Not verified:** whether the abeyance has been lifted or a new code issued since 2023. A lawyer must check the NMC site and Gazette for anything after August 2023. If a newer code is live, the analysis below must be re-run.

### 2.3 Platform margin that is not paid to the doctor: how it differs

[I] throughout this subsection.

- On its face, clause 6.4.1 regulates what a **physician** gives or receives. Careloop is not a physician; a margin kept by Careloop, paid by a vendor or built into the patient price, is not literally a commission to the doctor. That is the best argument for the model.
- Why it is still risky:
  1. **Indirect benefit to the doctor.** If the clinic gets a lower subscription, rebate, free seats, revenue share, perks, or a tiered plan that improves with test volume, the margin starts to look like a commission to the doctor routed through the platform. Anything that varies with the number or value of tests ordered is the danger zone.
  2. **Agent or alter-ego argument.** If a doctor owns, co-founds or is paid by Careloop, or a clinic group owns it, the regulator may treat Careloop's income as the doctor's.
  3. **Conflict of interest and patient trust.** A tool that the doctor uses to order, and whose operator profits on each order, can be said to steer ordering and vendor choice. Medical councils judge conduct on the doctor's independence and patient interest, not only on the literal clause.
  4. **Hidden pricing.** A margin the patient and doctor do not see invites consumer-protection and misleading-practice complaints (Consumer Protection Act and E-Commerce Rules 2020 [M, unverified]).
  5. **Lab-side rules.** The lab or aggregator paying anyone for referrals may raise separate issues; I did not find a source. [NF]
- Whether any medical council has ruled on a software-platform margin of this kind: **not found**. This is genuinely open.

### 2.4 Mitigations to put to the lawyer

- Charge clinics a flat subscription that does not vary with tests ordered. No per-doctor test-volume reporting, targets, leaderboards or rewards.
- Show the patient the full price and that Careloop earns a booking or technology fee, in the notice and on the screen. Keep the patient price at or below the lab's direct price.
- Doctor may choose any lab or decline the in-app route; the patient may take the prescription elsewhere.
- Prefer a **fixed, disclosed booking fee** over a percentage of the test price, though even that needs the lawyer's view.
- No test suggestions or default panels from the product (see Q3).
- Do not charge a margin until a written lawyer opinion exists (see go/no-go).

---

## 3. Who may order a test; what to restrict

- Telemedicine Guidelines 2020 are written for Registered Medical Practitioners (RMPs). [S] https://khaitanco.com/thought-leaderships/Telemedicine-Practice-Guidelines , https://psalegal.com/telemedicine-guidelines-2020-faq/
- Pathology report signing: the Supreme Court (December 2017) upheld the MCI position that a lab report is signed only by a registered doctor with a postgraduate pathology qualification. [S] https://www.livelaw.in/laboratory-report-can-counter-signed-registered-medical-practitioner-post-graduate-qualification-sc-read-order/?infinitescroll=1 , https://medicaldialogues.in/mci-board-of-governors-clarify-on-who-can-sign-laboratory-reports . A Delhi High Court challenge on non-medical signatories was reported; outcome not seen. [S] https://medicaldialogues.in/govt-rules-allowing-pathology-labs-to-run-without-doctors-delhi-hc-directs-centre-nabl-to-respond
- Allied health: the NCAHP stated that physiotherapists and occupational therapists cannot prescribe medicines or give allopathic treatment, with action under Section 59 of the NCAHP Act 2021 for violations. [S] https://english.gujaratsamachar.com/news/health/physiotherapists-occupational-therapists-cannot-prescribe-medicines-national-body-reiterates-18267746257.html . Act text (not opened): https://www.indiacode.nic.in/bitstream/123456789/16824/1/A2021-14.pdf
- Dietitians' scope to order tests: **not found**. Coaches and trainers: no statutory authority found; none should be assumed. [I]
- Whether labs may accept a test with no prescription (self-referred, direct-to-consumer) is common practice but I did not find a rule. [NF]

[I] Product restrictions Careloop should build:

1. Only a user with a verified medical registration (number checked against the relevant register, record kept) can create or edit a diagnostic order. Dietitians, physios, coaches and trainers get read-only or no access to the order screen.
2. The order records the prescribing RMP's name, registration number and council, and the date.
3. No auto-suggested panels, no "recommended tests", no retest reminders generated by software (also required by RULES.md). Retesting reminders appear only if the doctor sets the date.
4. Non-doctor roles cannot see report values by default; the doctor opts in per patient. The WhatsApp coach sees only "report received, doctor reviewing".
5. Role and audit log for every order, view and change.
6. Patient-initiated tests (no doctor) are out of scope for Vial.

---

## 4. Telemedicine Practice Guidelines 2020

- Issued 25 March 2020 as Appendix 5 to the 2002 regulations by the Board of Governors then in supersession of the MCI. [S] https://khaitanco.com/thought-leaderships/Telemedicine-Practice-Guidelines , https://conventuslaw.com/report/india-note-on-telemedicine-practice-guidelines/
- Reported content: RMP must gather adequate information before prescribing medicines; prescribing without an appropriate or provisional diagnosis is described as misconduct; the RMP may receive reports and radiological investigations from the patient. First consultations by telemedicine are permitted; a prohibited drug list exists. [S] https://psalegal.com/telemedicine-guidelines-2020-faq/ , https://healthcareitstrategy.blogspot.com/2020/05/summary-telemedicine-practice-guidelines.html (blog, weak)
- **Not found:** the clause text on ordering investigations by teleconsultation and on reviewing reports remotely. Primary PDF candidates (not opened): https://covid19dashboard.mohfw.gov.in/pdf/Telemedicine.pdf , https://nmcn.in/oldsite/pdf/Telemedicine%20Practice%20Guidelines.pdf .
- [I] Practical reading: tests are the RMP's judgment, the RMP is accountable, and the RMP should have enough information first (a consultation, history, or an existing relationship). Careloop should make the doctor confirm, per order, that the clinical assessment was done, and should keep records of consults, consent, prescription and report review. If the doctor says "reviewed", that is the doctor's act, not Careloop's.
- A lawyer should confirm any rule on record retention, patient identification, consent and the format of a prescription for tests issued remotely.

---

## 5. Medical device and practising medicine risk

### 5.1 CDSCO

- Software that meets the Medical Devices Rules 2017 definition of a device (diagnosis, prediction, prevention, monitoring, treatment) can be a regulated medical device. CDSCO issued draft guidance on medical device software on 21 October 2025, separating SiMD and SaMD; classification turns on intended use. [S] https://www.india-briefing.com/news/cdsco-draft-guidance-medical-software-40691.html , https://corporate.cyrilamarchandblogs.com/2026/01/medical-device-as-software-has-cdsco-guidance-changed-the-rules/
- One source (Emergo, dated July 2026) says final guidance has been issued. Single source, **not verified**. https://www.emergobyul.com/news/india-cdsco-finalizes-guidance-medical-device-software
- I found nothing specific on clinical decision support or on display-only software. [NF]

### 5.2 Interpretation of risk

[I]:

- **Lower risk:** storing and displaying values exactly as the lab reported them, with the lab's own reference ranges and units, the lab's own flags, a date axis, and a plain trend line, with no Careloop-generated meaning.
- **Higher risk:** any Careloop logic that labels a result "good/bad/at risk", scores, predicts, recommends an action or a test, sets alerts on thresholds that Careloop chose, or tells the patient what a value means. That moves toward software with a medical purpose and toward practising medicine.
- **WhatsApp coach:** a coach who explains what a value means, links a value to diet changes, or reassures or alarms is at risk of practising medicine without registration. [M] The NMC Act 2019 and state laws address unqualified practice; section numbers not verified. [NF this session]

### 5.3 Wording that stays on the safe side (draft)

- Do: "Your lab report is ready. Your doctor will review it. Open to view the values as reported by the lab." "Values shown are copied from the lab report. They are not a diagnosis."
- Do: "Trend of your results over time, as reported by the lab. Ask your doctor what it means for you."
- Do not: "Your cholesterol is dangerously high", "You are pre-diabetic", "Skip this meal", "We recommend a retest", "Normal".
- Coach script: "I can see your report has arrived. Your doctor will go through it with you. I cannot comment on the numbers."
- Put the doctor's review status on the screen: "Pending doctor review" vs "Reviewed by Dr X on date". Only the doctor's own written comment is shown as a comment.

---

## 6. Aggregator and lab rules

- Clinical Establishments (Registration and Regulation) Act 2010 [M]: applies to diagnostic laboratories in states that adopted it or through state laws. I did not find a source this session. [NF] Karnataka and several states have their own acts [M]. Lawyer to confirm which law covers the labs and the aggregator in each state of operation.
- NABL accreditation is a quality accreditation scheme [M]; whether it is mandatory for labs generally: not found. ABDM facility verification lists NABL/NABH status as an attribute. [S] https://abdm.gov.in:8081/uploads/Open_Call_for_Expression_of_Interest_28_8_2023_54610e2b49.pdf . Require hlthstack to name each lab, its accreditation scope and the test-by-test accreditation, with certificates.
- Report signing by a qualified pathologist: see Q3 sources. Ask that every report shows the signing doctor's name and registration.
- Home sample collection: no specific rule found. [NF] Points to ask the vendor: phlebotomist qualification and ID, consent at the door, tube labelling and chain of custody, cold chain and turnaround, biomedical waste handling [M], and recollection when a sample is rejected.
- Online aggregator regulation: **no specific rule found**. [NF] A Bombay High Court item on illegal pathology labs exists but was not read. https://www.omnicuris.com/medshots/panorama/bombay-high-court-regulatory-clarity-illegal-pathology-laboratories_27-Aug-26_16-07
- [M, unverified] E-commerce marketplace rules may treat Careloop as a marketplace or the seller of record depending on structure. Lawyer to decide who is the seller, who issues the invoice, and the GST treatment.

---

## 7. ABDM

- ABHA creation is voluntary for individuals, per a Lok Sabha reply quoted in a secondary source. [S] https://eparlib.sansad.in/bitstream/123456789/2983662/1/AU912_zPFLKv.pdf (not opened; summarised by search) and ABDM's own document https://abdm.gov.in:8081/uploads/Open_Call_for_Expression_of_Interest_28_8_2023_54610e2b49.pdf
- Provider participation is described as voluntary by most sources. [S] https://theprint.in/india/india-cant-afford-to-keep-pvt-healthcare-out-of-ayushman-bharat-digital-govt-must-do-more/1216933 . A vendor blog says mandates for private providers are expected to widen; no official notification found. https://atmsoftek.in/abdm-abha-nowcompliance-why-healthcare-businesses-must-adapt/
- [I] Treat ABDM as optional for Vial. It is not a precondition for a demo or first booking. Revisit if a clinic customer or a state requires it. Official source to check: https://abdm.gov.in

---

## 8. Draft consent notice and hlthstack contract clauses

### 8.1 Draft patient consent notice (about 150 words; for lawyer review)

> **Booking your blood test**
> Dr [name] has asked for this test as part of your care plan. To book it, Careloop will share your name, age, sex, phone number, address and the test name with our partner hlthstack and its accredited lab, who will collect your sample and prepare your report. The report comes back to Careloop and goes to your doctor for review. Your doctor, not Careloop, decides what it means.
> Careloop may earn a booking fee on this test. The full price you pay is shown before you confirm.
> Your information is used only to book, carry out and deliver this test and your care. It is stored in India [confirm]. We keep it for [period] and delete it when you ask, unless the law or your doctor's records require us to keep it.
> You can withdraw consent at any time in Settings or by writing to [grievance contact]. Withdrawing may stop this booking. Questions or complaints: [name, email]. If unresolved you can complain to the Data Protection Board.
> [ ] I agree. (Separate box for any optional use such as reminders.)

Notes: this is for patients aged 18 and above; a child needs a parent flow. Also show the vendor's name, the lab's name and the sample collector's ID in the confirmation. Plain language in the patient's language options. Exact statutory content must be checked against the Rules.

### 8.2 Clauses to demand from hlthstack (Aayuv Technologies / ekincare)

1. **Data processing agreement** that names roles for each data flow (fiduciary or processor), purposes, and instructions; processing only on documented instructions.
2. **Sub-processors:** list of all labs, logistics, cloud and WhatsApp or SMS providers; prior notice and right to object to changes; flow-down of the same terms.
3. **Lab accreditation and licences:** NABL certificates with test scope, clinical establishment registration, pathologist signing details; warranty that they stay valid; notice of lapse.
4. **Liability for sample and report errors:** responsibility for sample mix-ups, damage, delays, wrong or mis-attributed reports; recollection at no cost; indemnity for harm; insurance (professional and cyber); no cap, or a high cap, for data breach and clinical-error claims.
5. **Report integrity:** structured report returned unchanged, with the lab's units and ranges, signature and timestamp; corrections issued as new versions with an audit trail.
6. **Security standards:** encryption in transit and at rest, access control, audit logs, India hosting (or stated locations), penetration test evidence, certifications (for example ISO 27001) if held.
7. **Breach notice:** notify Careloop without delay and within a short fixed time (for example 24 hours) with details; cooperation with Careloop's own notice to the Board and patients.
8. **Retention and deletion:** retention periods; deletion or return of all Careloop patient data on request and on exit within a fixed period, with a certificate; carve-out only for records the vendor must keep by law, stated and limited.
9. **Exit and portability:** data export in an open format; transition help; no lock-in on patient records.
10. **No secondary use:** no marketing, no sale, no analytics or model training on the data, no sharing with ekincare's other products without a separate consent.
11. **Commercial terms and disclosure:** price list and how any margin is computed; written statement that nothing is paid to any doctor or clinic; audit right; most-favoured price (patient price no higher than direct).
12. **Patient grievance and rights:** support for access, correction, withdrawal and erasure requests; a named contact.
13. **Audit rights and compliance warranties:** compliance with DPDP, medical and lab laws; right to audit or receive audit reports.
14. **Governing law, dispute resolution, termination for regulatory change.**
15. **Anti-steering:** hlthstack does not market to Careloop's patients.

---

## 9. Go / no-go table

All items need a lawyer's confirmation. "Must" means no-go until done.

| Gate | Must be in place | Status today |
|---|---|---|
| **(a) Synthetic-data demo** | Only synthetic data, labelled as such on screen. No real name, phone, number or report. No outreach to hlthstack with real data. Disclaimer: "Demo. Not medical advice. Values are fake." No claims that Careloop is accredited or that tests are real. No calls to the real hlthstack production system unless the owner approves. Wording per 5.3. | Go, if the above holds. |
| **(b) First real patient booking** | (1) Written lawyer opinion on Q2 (even with margin off), Q3 and Q5. (2) Signed DPA and contract with hlthstack covering 8.2 items 1 to 10. (3) Lab accreditation and clinical establishment evidence for the labs used. (4) Consent notice approved and live; withdrawal and grievance route working. (5) Doctor-only ordering with registration check and audit log built. (6) No Careloop interpretation of values; WhatsApp coach script restricted. (7) Breach response plan and contacts. (8) Data location confirmed; security review done. (9) Clinic terms: the doctor is responsible for clinical decisions and review. (10) Owner approval for each spend or outreach step (RULES.md). (11) Adults only; child flow blocked until built. | No-go today. |
| **(c) Charging a margin** | Everything in (b), plus: (1) Written lawyer opinion specifically on a platform margin and the NMC code in force (check abeyance status). (2) Flat subscription not linked to test volume; no doctor-level volume incentive. (3) Full price and the fee disclosed to patient and doctor. (4) Contract clause that nothing flows to doctors or clinics. (5) Tax and invoicing structure decided (who is seller). (6) Doctor can choose another lab. (7) Consider a fixed disclosed fee rather than a percentage. | No-go. Highest risk. |

---

## 10. What was not verified, and what a lawyer must confirm

Not verified this session (no primary source opened):

- The text of the DPDP Act and Rules; the exact commencement dates; the breach timeline; notice content; whether health data has any special treatment; which obligations apply to a small processor.
- The exact wording of 2002 clause 6.4 and related clauses; whether the 2023 NMC regulations are still in abeyance or replaced; any NMC or state council decision on platform margins.
- Telemedicine Guidelines text on ordering investigations and reviewing reports.
- CDSCO final software guidance status and any position on display-only or decision-support software.
- Clinical Establishments Act applicability, state laws, NABL requirements, home-collection rules, aggregator rules, e-commerce marketplace status.
- Dietitian scope of practice; unqualified practice provisions; the Bombay and Delhi High Court items.
- ABDM official notifications; whether any state mandates it.
- Section numbers (all [M] items).

A health-law lawyer in India must confirm: (1) the margin structure; (2) the DPDP roles and contract set; (3) the product's role rules and WhatsApp coach scripts; (4) the lab and aggregator licensing chain; (5) consent notice wording; (6) any state-level rules where clinics operate; (7) the changes since the dates of the sources used here.

Primary sources to check (network access needed): https://www.meity.gov.in , https://www.nmc.org.in , https://abdm.gov.in , https://www.indiacode.nic.in , https://cdsco.gov.in , the Gazette of India.

## 11. Source list (secondary, from search results)

- https://www.legal500.com/firms/237811-saga-legal/c-india/news-and-developments/the-privacy-timer-starts-now-analysing-the-dpdp-rules-and-its-18-month-countdown
- https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/
- https://www.theweek.in/wire-updates/business/2025/11/14/del148-biz-dpdp-rules-ld-govt.html
- https://www.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025-notified
- https://www.mondaq.com/india/data-protection/1708268/legal-analysis-of-digital-personal-data-protection-rules-2025
- https://www.dsci.in/files/content/knowledge-centre/2025/Insight-Brief-on-DPDP-Rules.pdf
- https://lawrbit.com/article/digital-personal-data-protection-rules-2025
- https://www.dpdpa.com/dpdparules/rule7.html
- https://www.barandbench.com/columns/the-dpdp-cross-border-transfer-rules-arent-live-yet-so-why-are-contracts-being-redrafted-as-if-they-are
- https://ksandk.com/data-protection-and-data-privacy/cross-border-data-transfers-dpdp-act-india/
- https://www.mondaq.com/india/healthcare/1173338/inducements-by-medical-practitionersthe-why-not
- https://future.indiankanoon.org/doc/100527417/
- https://medicaldialogues.in/health-news/nmc/breaking-news-nmc-puts-its-controversial-registered-medical-practitioner-professional-conduct-regulations-2023-put-on-hold-116314
- https://legalitysimplified.com/?p=36875
- https://medicaldialogues.in/news/health/doctors/nmc-orders-crackdown-on-referral-fee-commissions-and-online-procurement-of-patients-94297
- https://khaitanco.com/thought-leaderships/Telemedicine-Practice-Guidelines
- https://psalegal.com/telemedicine-guidelines-2020-faq/
- https://conventuslaw.com/report/india-note-on-telemedicine-practice-guidelines/
- https://www.india-briefing.com/news/cdsco-draft-guidance-medical-software-40691.html
- https://corporate.cyrilamarchandblogs.com/2026/01/medical-device-as-software-has-cdsco-guidance-changed-the-rules/
- https://www.emergobyul.com/news/india-cdsco-finalizes-guidance-medical-device-software
- https://www.livelaw.in/laboratory-report-can-counter-signed-registered-medical-practitioner-post-graduate-qualification-sc-read-order/?infinitescroll=1
- https://medicaldialogues.in/mci-board-of-governors-clarify-on-who-can-sign-laboratory-reports
- https://english.gujaratsamachar.com/news/health/physiotherapists-occupational-therapists-cannot-prescribe-medicines-national-body-reiterates-18267746257.html
- https://theprint.in/india/india-cant-afford-to-keep-pvt-healthcare-out-of-ayushman-bharat-digital-govt-must-do-more/1216933
- https://abdm.gov.in:8081/uploads/Open_Call_for_Expression_of_Interest_28_8_2023_54610e2b49.pdf
