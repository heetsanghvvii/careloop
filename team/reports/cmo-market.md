# Project Vial: CMO market report

Date: 2026-11-11. Author: CMO agent. Method: 14 web searches (search-result summaries only). I did not open any vendor page directly (no WebFetch calls), so everything below is as reported by search snippets and must be re-verified on the live page. No signups, no outreach, no spend.

Source quality key: [V] vendor-authored, [R] reseller or aggregator (weak), [M] market-research firm (definitions differ, treat as rough), [N] news.

## 1. Vendors with B2B diagnostics API or partner programme

| Vendor | API access (public) | Structured results | Coverage | Partner pricing / margin |
|---|---|---|---|---|
| hlthstack / ekincare (Aayuv) | Not found. Searches for "hlthstack.io" returned nothing from that domain; the only look-alike was an unrelated US "HealthStack.io" (village.ai/company/healthstack-io). The owner's brief is the only source for the hlthstack link. | Not found | Not found | Not found |
| Orange Health | A "Partner API" exists: Serviceability, Orders, Results; webhooks (HMAC-signed), sandbox and production, API key auth, contact integrations@orangehealth.in. Source is an unofficial aggregator, generated from the vendor's Apiary blueprint: https://apis.io/providers/orange-health/ , https://apis.io/apis/orange-health/orange-health-orders-api/ , https://apis.io/apis/orange-health/orange-health-results-api/ [R, derived from V]. Official Apiary docs not checked. | A Results API is listed; payload format not verified | Home collection in "several Indian cities"; city list not verified. Marketing claims 60 min collection and ~6 h results (via the same aggregator summary and https://www.orangehealth.in/blog/orange-health-amazon-partnership [V], not opened). | Not found. One review note (via search summary) says partner-placed orders have report sharing managed by the partner. |
| Redcliffe Labs | Partner page describes a B2B booking module with API and webhooks, bulk upload, partner dashboard, partner app: https://redcliffelabs.com/strategic-alliance , https://redcliffelabs.com/corporate-tieups [V]. No public API docs found. | Not found | Medstown tie-up claims 220 Indian cities: https://www.digitalhealthnews.com/medstown-partners-with-redcliffe-labs-to-expand-diagnostics-access-across-220-indian-cities [N, not opened] | Not found |
| Tata 1mg | Partner page lists "API Integration" (white-label pharmacy and diagnostics) and SSO: https://1mg.com/partnerships/products/healthPartner [V]. No public docs. | Not found | Not found | Not found |
| Healthians | No public partner API found. Positions itself as home-collection operator working with partner labs; has co-marketing partnerships (e.g. DreamFolks): https://www.indiainfoline.com/news/business/dreamfolks-partners-with-healthians-for-check-ups [N] | Not found | Not found | Not found |
| Thyrocare (PharmEasy group) | No public API or partner docs found. Ownership context: https://www.bloombergquint.com/business/pharmeasy-aims-to-complete-thyrocare-integration-in-18-24-months [N, dated; later ownership claims in search summary unverified] | Not found | Not found | Not found |
| PharmEasy, Metropolis, others | Not searched individually (budget). Not found / unverified. | | | |

Takeaways: Orange Health and Redcliffe publicly signal API and webhook integrations; none of the vendors publish partner pricing or margins. Margin terms will need a sales conversation, which is blocked by RULES.md until the owner approves outreach. Whether any vendor returns machine-readable (LOINC-coded or similar) results is not verified.

## 2. Similar Indian platforms bundling blood tests

| Platform | What I found | Source | Confidence |
|---|---|---|---|
| HealthifyMe | A "Metabolic Panel" (80+ parameters: lipid, kidney, liver, thyroid, diabetes, vitamins, iron, hemogram, urine; single-prick home visit; 48 h report) bundled into HealthifyPro. Search summary reports HealthifyPro from about Rs4,000 per month and Pro+ from about Rs6,000 per month, each including a CGM every 6 months and smart scale. No standalone panel price found. | https://plans.healthifyme.com/healthifyme-metabolic-panel [V, not opened] | Medium, prices need confirming on live page |
| Fitterfly | Diabetes programme pages found, no price or lab inclusion in snippets. Not found. | https://fitterfly.com/diabefly | n/a |
| Sugarfit | Programme components (CGM, doctor consults, glucometer) per 2022 article; no price, no lab-test inclusion found. | https://yourstory.com/2022/01/healthtech-startup-sugarfit-curefit-diabetes-management-healthcare/amp [N] | Not found |
| Fitelo, Twin Health | Not found in results. | | Not found |
| TatvaCare (adjacent) | A diabetes care plan at Rs2,166 per month listing HbA1c among included tests (per search summary). | https://www.tatvacare.in/?p=4879 [V, not opened] | Low |

Pattern (inference, label: assumption): where tests are bundled, they appear inside a monthly or multi-month subscription rather than itemised, and the lab is typically a white-labelled partner. I could not verify who the lab partners are.

## 3. Public retail prices (India)

Individual-test prices from primary labs were mostly NOT found. What the searches returned:

| Item | Price | Source | Quality |
|---|---|---|---|
| Lipid profile (Orange Health, Gurgaon) | Rs690 list, Rs600 after 13% off | https://www.orangehealth.in/lab-tests-gurgaon?p=7370 | [V], search snippet, city-specific |
| Single tests at a small lab: HbA1c Rs280, CBC Rs150, B12 Rs500, Vitamin D Rs550, thyroid profile Rs250 | as stated | https://suryalabs.lovable.app/services | Weak: an unverified small-lab site, not representative. Use only as a low-end anchor. |
| Bundle with CBC, FBS, HbA1c, Vit D and B12 (1mg "Comprehensive Blood Test", Amritsar) | Rs1,099 | https://www.1mg.com/labs/test/comprehensive-blood-test-33564/amritsar/price | [V], city-specific |
| Orange Health full body packages | From Rs1,099 (sale); Vit D and B12 body checkup Rs1,499; "Full Body Checkup Complete" (includes fasting insulin, HbA1c, lipid, Vit D, CBC) Rs4,999 | https://www.orangehealth.in/health-checkups-noida/full-body-checkup-complete?p=7370 , https://www.orangehealth.in/lab-tests-gurgaon?p=7370 | [V], promotional, may have changed |
| Thyrocare Aarogyam variants via resellers | About Rs799 to Rs979 (Monsoon basic, with HbA1c, TSH, Vit D, B12); Rs1,567 (24x7 non fasting mini); Rs2,039 to Rs3,599 (Aarogyam C, D); Rs5,499 (a package with HbA1c and fasting insulin) | https://www.bloodtestsathome.in/package/aarogyam-monsoon-basic , https://www.secondmedic.com/lab/thyrocare/aarogyam-24x7-non-fasting-mini , https://bloodtestsathome.in/package/aarogyam-c | [R], some are old promotions |
| Fasting insulin standalone | Not found | | |
| HbA1c, CBC, thyroid, Vit D, B12 standalone from Orange, Healthians, 1mg, Thyrocare | Not found | | |

Honest reading: a lifestyle panel (CBC, HbA1c, lipid, thyroid, Vit D, B12, insulin) priced as a bundle appears to land roughly Rs1,100 to Rs5,500 on public pages in this sample. This range is my own inference from the rows above, not a sourced figure. Collection fees: one reseller listing says free home collection above Rs300 (https://www.bloodtestsathome.in/package/aarogyam-monsoon-basic, [R]); not verified for any primary lab.

## 4. Market size (all [M], definitions inconsistent)

- India diagnostics services: USD 35.4 bn in 2024, 13.4% CAGR to 2030. Source cited in search summary: Ken Research https://www.kenresearch.com/india-diagnostics-services-market (not opened; figure came through the search summary, attribution to that page is likely but not confirmed).
- Another firm: USD 11.8 bn for 2025 (source page not identified in my results). Treat as unconfirmed.
- Diagnostic labs: IMARC USD 9.8 bn in 2024 to USD 28.4 bn by 2033, 11.21% CAGR: https://www.imarcgroup.com/india-diagnostic-labs-market
- Diagnostic labs: INR 1.54 trillion FY2024 to INR 2.98 trillion FY2030 (~11.7% CAGR): https://www.businesswire.com/news/home/20250527862915/en/India-Diagnostic-Laboratories-Market-Report-2025-Market-Set-to-Double-by-2030-Driven-by-Healthcare-Awareness-Tech-Advancements (press release for a paid report, [M/V])
- Home diagnostic services: USD 221.38 mn in 2024 to USD 328.51 mn by 2031, 5.8% CAGR: https://blueweaveconsulting.com/press-release/india-home-diagnostic-services-market-set-to-cross-usd-328-million-by-2031
- Spread across sources is about 3x for the broad market and home collection is sized by only one source. None are suitable for a business case beyond "large and growing". A bottom-up model (assumption-based, not done here) is better than quoting these.

## 5. Where Careloop plus doctor-reviewed tests fits

- Position (assumption): the vendors sell tests to individuals or employers; coaching apps bundle a lab panel inside a subscription. Careloop's gap is test ordering driven by the patient's own doctor inside the daily follow-through loop, so the test is part of a clinician plan rather than a consumer purchase. I found no evidence that any named competitor does exactly this, but I did not verify competitor products in depth.
- Economics (unverified): the practical entry is the partner-API route (Orange and Redcliffe signal it). Margin, white-labelling and result-data rights are unknown until the owner authorises contact. Price anchor for the patient: roughly Rs1,100 to Rs5,500 for a bundle (inference above), against HealthifyMe bundling a panel inside Rs4,000+ per month.
- Risks and constraints: all test choices stay with clinicians per RULES.md, so positioning must say "doctor prescribes, Careloop schedules and displays"; hlthstack itself has no public footprint I could find, so diligence on it (API docs, data-protection terms, lab accreditation) is the first open item, and no real patient data goes in until safeguards are agreed.

## Not verified (summary)

- hlthstack/ekincare API, results format, coverage and pricing: nothing public found.
- Any partner pricing or margin for any vendor.
- Official Orange Health Apiary docs; Redcliffe, 1mg partner terms.
- Sugarfit, Fitterfly, Twin Health, Fitelo pricing and test bundling; HealthifyMe prices came via a search summary of its plan page.
- Standalone retail prices for most requested tests; fasting insulin entirely.
- Pages were not opened; reseller and small-lab prices are weak and city or date specific.
