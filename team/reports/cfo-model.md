# Project Vial: CFO model, diagnostics line, 12 months

Author: CFO agent. Date: 11 Nov 2026. Rules followed: /home/user/careloop/team/RULES.md (Rs0 spend, no signup or outreach, synthetic data only, clinicians decide tests, no em dashes). No money spent, nobody contacted, nothing committed.

**Read this first.** Careloop has no paying customers and no doctor has validated it. Every volume number below is an ASSUMPTION, not data. hlthstack's rate card, minimum recharge, fees, resale rights and sandbox cost are UNCONFIRMED. The model shows what must be true for the line to pay; it does not forecast.

## 1. Headline

- Base case does NOT pay back in 12 months. Cumulative operating cash at month 12: Rs -84,410. Month 12 net is still Rs -1,859 per month.
- Base peak cash need (cumulative loss plus wallet float): Rs 109,410.
- Low case: cumulative Rs -155,233, never pays back. High case: cumulative +Rs 218,818, cumulative cash turns positive in month 7 (assumes 25 clinics by month 12 and 35% margin, neither of which is evidenced).
- Base run-rate break-even (monthly, ignoring the one-off legal cost): about 32 booked orders a month, about 26 clinics at 1.2 orders per clinic per month. Recovering the Rs 60,000 legal cost on top takes longer still.

## 2. Inputs (every row is an ASSUMPTION unless a source is shown)

| Input | Low | Base | High | Status and source |
|---|---|---|---|---|
| Paying clinics enabled for diagnostics, month 1 to 12 | 0,0,1,1,1,1,1,2,2,2,3,3 | 0,0,1,1,2,3,4,5,6,8,9,10 | 0,0,1,2,4,7,10,13,16,19,22,25 | ASSUMPTION. Months 1 to 2 are demo and legal setup, first real booking in month 3. No paying Careloop customer exists today. |
| Active patients per clinic | 20 | 40 | 70 | ASSUMPTION. Published plan caps are 25, 100 and 300 participants (Starter, Growth, Scale); no usage data exists. |
| Share of patients given a test order (per year) | 15% | 30% | 50% | ASSUMPTION. Clinical choice stays with the doctor; this is only a volume guess. |
| Orders per ordered patient per year | 1.5 | 2 | 3 | ASSUMPTION. Treated as the same thing as tests per patient per year (one order = one booking). |
| Order-to-booking conversion (patient actually books) | 40% | 60% | 80% | ASSUMPTION. Added by CFO; the brief did not list it but orders do not equal bookings. |
| Average order value, Rs (patient price) | 600 | 900 | 1,300 | ASSUMPTION informed by public retail prices in section 3 (single tests Rs 270 to 1,000; packages Rs 800 to 4,000). |
| Vendor cost as % of patient price | 85% | 75% | 65% | ASSUMPTION. hlthstack rate card NOT FOUND. Implied margin 15% / 25% / 35%. |
| Failed or cancelled collection rate | 20% | 10% | 5% | ASSUMPTION. No public figure found. Patient fully refunded. |
| Vendor charge on a failed visit, Rs per failed order | 150 | 100 | 50 | ASSUMPTION. Whether hlthstack charges for failed visits is unknown. |
| Payment gateway fee incl. GST on fee, on all booked value | 2.36% | 2.36% | 2.36% | ASSUMPTION: 2% plus 18% GST on the fee. Gateway not chosen; not verified. |
| Post-completion refunds or redraws, % of gross value | 4% | 2% | 1% | ASSUMPTION. Refund returns price; vendor cost is not recovered. |
| Support cost, Rs per booked order | 100 | 60 | 40 | ASSUMPTION. Outsourced or part-time support valued in cash. |
| Hosting and monitoring, Rs per month from first live month | 2,500 | 1,000 | 1,000 | ASSUMPTION. Incremental only. |
| Accounting and GST filing for the resale line, Rs per month | 3,000 | 2,000 | 2,000 | ASSUMPTION. GST treatment of resold diagnostics NOT VERIFIED; needs a CA. |
| Legal review one-off (month 2), Rs | 100,000 | 60,000 | 40,000 | ASSUMPTION. Covers vendor contract, resale rights, patient consent and DPDP data handling. No quote obtained. |
| Wallet float floor (minimum prepaid balance), Rs | 50,000 | 25,000 | 25,000 | ASSUMPTION. hlthstack minimum recharge NOT FOUND. Float = the larger of this floor or 1.5 months of vendor cost. |
| Engineering time | Rs 0 | Rs 0 | Rs 0 | Valued at Rs 0 cash (built by AI agents), per the brief. |
| hlthstack setup, transaction or sandbox fee | Rs 0 | Rs 0 | Rs 0 | UNKNOWN, modelled as Rs 0. If any exist the model is too optimistic. |

Per-order mechanics: booked orders = clinics x patients x share x conversion x orders per year / 12. Completed = booked x (1 - failed rate). Gross value = completed x AOV. Vendor cost = gross value x vendor %. Gateway fee applies to all booked value (fee on refunded failed bookings is assumed not returned). Float is a recoverable balance, shown separately and not counted as an expense.

## 3. External price and margin evidence (web search, 7 of about 8 budget used)

All figures are public retail listing prices, found via search snippets; I did not open every page and the search tool itself said many listings were undated or conflicting. They are patient-side prices, not vendor cost. Treat as ranges only.

| Item | Range seen (Rs) | Source URLs | Caveat |
|---|---|---|---|
| HbA1c | about 270 to 500 (Tata 1mg 329 to 399 by city; Redcliffe 299 to 349; Healthians about 273 to 480) | https://www.1mg.com/labs/test/hba1c-1611/delhi/price ; https://redcliffelabs.com/delhi/package/hba1c-test ; https://labsadvisor.com/cost-of-hba1c-test-in-india | Aggregator pages conflict; some contain template text. |
| Lipid profile | about 275 to 1,000 (Healthians 275 Delhi; Redcliffe 399; Orange Health 600 to 700; Max Lab 1,000) | https://www.bajajfinservhealth.in/lab-tests/central-delhi/lipid-profile ; https://www.maxlab.co.in/lab-test/profile/delhi/lipid-profile-test ; https://pharmeasy.in/diagnostics/profile/lipid-profile-105/mumbai-166 | Some listings exclude collection charge. |
| Thyroid (T3, T4, TSH) | about 360 to 860 (Orange Health 400; Max Lab 500 to 550; 1mg free profile 609 to 859) | https://www.maxlab.co.in/lab-tests/total-thyroid-profile ; https://pharmeasy.in/diagnostics/profile/thyroid-profile-t3-t4-tsh-1804/delhi-127 ; https://www.labsadvisor.com/cost-of-thyroid-profile-in-india | Total vs free hormones differ. A discount aggregator claims about 232 average; not verified. |
| Vitamin D (25-OH) | about 280 to 1,600 (Bajaj Finserv Health 280 to 294; 1mg 308 to 1,000 by city; Max Lab 900 to 1,600) | https://www.bajajfinservhealth.in/lab-tests/north-west-delhi/vitamin-d-total-25-hydroxy ; https://www.1mg.com/labs/test/vitamin-d-25-hydroxy-1972/indore/price ; https://www.maxlab.co.in/lab-test/profile/delhi/25-hydroxy-vitamin-d-level-serum | Very wide city spread. |
| Full body package | about 799 to 4,000 (Redcliffe Smart 799 discounted; Metropolis TruHealth about 3,000; Healthians 1,549 to 5,099) | https://redcliffelabs.com/delhi/package/smart-full-body-checkup ; https://www.metropolisindia.com/health-packages/truhealth-prime ; https://www.secondmedic.com/blog/full-body-checkup-price-in-india-packages-compared | Discounted vs MRP; package contents differ. |
| Aggregator or B2B lab partner margin | NOT FOUND (no public take rate) | Indirect only: https://www.careratings.com/uploads/newsfiles/1763463740_Indian%20Diagnostics%20Industry_%20Opinion%20Piece.pdf (large lab EBITDA-type margins of 23 to 25%, a lab's own margin, not an aggregator take rate); https://inpractise.com/articles/dr-lal-pathlabs-indian-d2c-diagnostics (interview-based gross margin about 60%, EBITDA about 10%, unverified) | Does not tell us what hlthstack will charge Careloop. The 15 / 25 / 35% margin is a guess. |
| hlthstack | NOT FOUND (search returned nothing for the name) | n/a | Rate card, recharge, fees, resale rights all unverified. |

How the AOV was chosen: one to three common tests or a basic package. Mid-points of the ranges above are roughly HbA1c 350, lipid 450, thyroid 500, vitamin D 600, package 1,500. Base AOV Rs 900 is my judgement of a typical order mix (ASSUMPTION). Low Rs 600 and high Rs 1,300 bracket it. Retail prices already include heavy consumer discounting, so a doctor-assigned order may price near the low end of these ranges, which argues for a lower AOV, not higher.

## 4. Base case month by month (Rs unless stated)

| Month | Clinics | Orders booked | Completed | Gross booking value | Vendor cost | Failed-visit cost | Gross margin | Gateway | Refunds | Support | Fixed | Total costs | Net | Cumulative cash | Wallet float needed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 0.0 | 0.0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0 | 0.0 | 0.0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 60,000 | 60,000 | -60,000 | -60,000 | 0 |
| 3 | 1 | 1.2 | 1.1 | 972 | 729 | 12 | 231 | 25 | 19 | 72 | 3,000 | 3,117 | -2,886 | -62,886 | 25,000 |
| 4 | 1 | 1.2 | 1.1 | 972 | 729 | 12 | 231 | 25 | 19 | 72 | 3,000 | 3,117 | -2,886 | -65,772 | 25,000 |
| 5 | 2 | 2.4 | 2.2 | 1,944 | 1,458 | 24 | 462 | 51 | 39 | 144 | 3,000 | 3,234 | -2,772 | -68,544 | 25,000 |
| 6 | 3 | 3.6 | 3.2 | 2,916 | 2,187 | 36 | 693 | 76 | 58 | 216 | 3,000 | 3,351 | -2,658 | -71,201 | 25,000 |
| 7 | 4 | 4.8 | 4.3 | 3,888 | 2,916 | 48 | 924 | 102 | 78 | 288 | 3,000 | 3,468 | -2,544 | -73,745 | 25,000 |
| 8 | 5 | 6.0 | 5.4 | 4,860 | 3,645 | 60 | 1,155 | 127 | 97 | 360 | 3,000 | 3,585 | -2,430 | -76,175 | 25,000 |
| 9 | 6 | 7.2 | 6.5 | 5,832 | 4,374 | 72 | 1,386 | 153 | 117 | 432 | 3,000 | 3,702 | -2,316 | -78,490 | 25,000 |
| 10 | 8 | 9.6 | 8.6 | 7,776 | 5,832 | 96 | 1,848 | 204 | 156 | 576 | 3,000 | 3,935 | -2,087 | -80,578 | 25,000 |
| 11 | 9 | 10.8 | 9.7 | 8,748 | 6,561 | 108 | 2,079 | 229 | 175 | 648 | 3,000 | 4,052 | -1,973 | -82,551 | 25,000 |
| 12 | 10 | 12.0 | 10.8 | 9,720 | 7,290 | 120 | 2,310 | 255 | 194 | 720 | 3,000 | 4,169 | -1,859 | -84,410 | 25,000 |
| **Total** | | 58.8 | 52.9 | 47,628 | 35,721 | 588 | 11,319 | 1,249 | 953 | 3,528 | 90,000 | 95,729 | -84,410 | -84,410 | 25,000 (month 12) |

Rows show rounded values from fractional orders (the model does not round orders), so a displayed row can differ from its parts by Rs 1.

## 5. Low, base and high summary (12-month totals)

| Row | Low | Base | High |
|---|---|---|---|
| Orders booked | 2.6 | 58.8 | 833.0 |
| Orders completed | 2.0 | 52.9 | 791.3 |
| Gross booking value | 1,224 | 47,628 | 1,028,755 |
| Vendor cost | 1,040 | 35,721 | 668,691 |
| Gross margin (after failed-visit cost) | 107 | 11,319 | 357,982 |
| Total costs (gateway, refunds, support, fixed) | 155,340 | 95,729 | 139,164 |
| Net, 12 months = cumulative cash | -155,233 | -84,410 | 218,818 |
| Month 12 net per month | -5,541 | -1,859 | 57,676 |
| Wallet float needed, month 12 | 50,000 | 25,000 | 210,722 |
| Peak cash need (loss plus float) | 205,233 | 109,410 | 81,040 |
| Cumulative cash break-even month | none in 12 months | none in 12 months | month 7 |

## 6. Break-even

Base case: it does not pay back in 12 months. Cumulative cash is Rs -84,410 at month 12 and the monthly net is still negative (Rs -1,859). Contribution per booked order in base is about Rs 95 (gross margin Rs 192.5 after failed-visit cost, less gateway Rs 21, refunds Rs 16, support Rs 60), against Rs 3,000 a month of fixed cost, so monthly break-even needs about 32 booked orders (about 26 clinics at base usage). Low case never pays back. High case pays back in month 7 but rests on three unsupported numbers: 25 clinics, 35% margin, 3 orders per patient per year.

## 7. Sensitivity (base case, one input changed at a time)

| Assumption (rank by effect on monthly net) | Half: 12m cum | Half: month 12 net | Double: 12m cum | Double: month 12 net | Pays back? |
|---|---|---|---|---|---|
| Vendor margin (25% base; half = 12.5%, double = 50%) | -90,364 | -3,074 | -72,503 | 571 | half: no; double: no |
| Orders per clinic (share given an order, 30% base) | -87,205 | -2,430 | -78,821 | -719 | half: no; double: no |
| Average order value (Rs 900 base) | -89,263 | -2,850 | -74,705 | 121 | half: no; double: no |
| Legal review one-off (Rs 60,000 base; fixed cost) | -54,410 | -1,859 | -144,410 | -1,859 | half: no; double: no |
| Paying clinics per month (all months scaled) | -81,376 | -2,430 | -78,821 | -719 | half: no; double: no |

Base for comparison: cumulative Rs -84,410, month 12 net Rs -1,859.

**Three most sensitive assumptions (operating):** (1) vendor margin, because it multiplies every order and is entirely unverified; (2) orders per clinic (share of patients given an order, with conversion and frequency behaving identically); (3) average order value. None of the three pays back in base even when doubled, because fixed cost and legal cost exceed the small margin pool; doubling margin or AOV gets month 12 net to about break-even only. Legal review is the largest single cash swing (Rs 60,000 base) but is a one-off, so it is listed separately. Volume of clinics matters less than expected because each clinic yields only about 1.2 orders a month in base.

## 8. Cash ask per phase

| Phase | Ask (Rs) | What it buys | Basis |
|---|---|---|---|
| Phase 1: synthetic-data demo | 0 | Demo of prescribe, book, report-return flow with synthetic data. Engineering valued at Rs 0. No hlthstack account, no real data. | Per owner rule. |
| Phase 2: first real bookings, one pilot doctor | 1,00,000 (range 40,000 to 1,70,000 across cases) | Legal review 60,000 (vendor contract, resale rights, consent, DPDP); wallet recharge 25,000 (recoverable if hlthstack allows refund, unknown); about 3 months hosting and accounting 9,000; contingency about 6,000 for failed-visit charges and refunds. | Base inputs; low case needs about 1,70,000 (legal 1,00,000 plus float 50,000 plus running costs). Requires owner approval first, plus prior written confirmation of rates. |
| Phase 3: scale beyond pilot | Up to 2,50,000, released only if stop rules pass | Mostly wallet float: 1.5 months of vendor cost, about Rs 2.1 lakh at high-case month 12 volume, plus about 40,000 buffer for operating losses. In base the float stays at the 25,000 floor, so Phase 3 would be only about Rs 15,000 to 25,000 more. | Formula in section 2. Do not release on the high case alone. |

Check: base peak cash need over 12 months is Rs 109,410, consistent with the Phase 2 ask of about Rs 1,00,000 plus a modest Phase 3 top-up. Do not treat Rs 0 Phase 1 as a commitment to Phase 2 or 3.

## 9. Stop rules (owner stops spending if any one trips)

| # | Rule | Why this number |
|---|---|---|
| 1 | hlthstack will not confirm in writing that resale with a margin is allowed, or vendor cost is above 85% of the patient price (margin below 15%) | At 15% margin, contribution per order falls to about Rs 28 and fixed cost never clears. |
| 2 | Contribution per booked order below Rs 60 after pilot data | Base is about Rs 95; below Rs 60 even 40 orders a month does not cover fixed cost. |
| 3 | Minimum wallet recharge above Rs 50,000, or any setup or monthly platform fee above Rs 2,000 | Both are beyond the base model and exceed what a 1-clinic pilot can justify. |
| 4 | Legal quote above Rs 1,00,000 or counsel advises the model needs a diagnostics licence or a regulated partner structure | Exceeds the low-case legal cost. |
| 5 | Failed or cancelled collection rate above 20% over the first 20 real bookings | Low-case rate; above it, failed-visit cost and refunds erode margin. |
| 6 | Fewer than 3 booked orders from the pilot clinic by the end of its second live month (month 4) | Base expects about 1.2 a month per clinic, so 3 in two months is a deliberately low bar. Below it the doctor is not using the feature. |
| 7 | Fewer than 3 clinics enabled by month 6, or fewer than 30 orders per month by month 9 | Base reaches 3 clinics in month 6; 30 a month is near the run-rate break-even of about 32. |
| 8 | Cumulative cash spent exceeds Rs 1,10,000 (base peak need) with no paying clinic beyond the pilot | The base peak is about Rs 1.09 lakh. |
| 9 | Any real patient data would reach hlthstack before permissions and safeguards are settled | Owner rule, not a number. |

## 10. What was NOT verified

- Any hlthstack rate, fee, minimum recharge, resale or white-label permission, failed-visit charge, refund terms on the wallet or sandbox cost (the name returned no search results).
- Any aggregator margin: no public take rate was found.
- That any doctor will prescribe tests through Careloop, that patients will book, and every volume input.
- GST, licensing and DPDP treatment of the resale line; gateway pricing; the actual price page contents (prices come from search snippets, many undated).
- Vendor marketing pages were not treated as fact.
- Careloop subscription revenue is excluded by design (diagnostics line only).

## 11. Arithmetic check

I re-added every total programmatically and by recomputation: for each month and each case, gross margin = gross value - vendor cost - failed-visit cost; total costs = gateway + refunds + support + fixed; net = gross margin - total costs; cumulative = running sum of net; and the sum of the 12 monthly nets equals the month 12 cumulative cash in all three cases. All assertions passed. The base total row was computed from unrounded values and is within Rs 1 of the sum of displayed rounded rows. Peak cash need = max over months of (negative cumulative + float). Sensitivity runs reuse the same function, changing one input.
