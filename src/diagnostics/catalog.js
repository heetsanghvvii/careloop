/**
 * Diagnostics test catalog (provider-agnostic).
 * ASSUMPTION: test codes and display names are ours; the real vendor's test codes are unknown and
 * must be mapped in the real provider adapter. Reference ranges here are MOCK PLACEHOLDERS used only
 * by the mock report generator. A real report always carries the lab's own reference range.
 */
export const TEST_CATALOG = Object.freeze({
  cbc: {
    code: 'cbc', name: 'Complete Blood Count',
    parameters: [
      { code: 'hb', name: 'Hemoglobin', unit: 'g/dL', low: 13.0, high: 17.0, decimals: 1 },
      { code: 'wbc', name: 'Total WBC count', unit: '/uL', low: 4000, high: 11000, decimals: 0 },
      { code: 'plt', name: 'Platelet count', unit: '/uL', low: 150000, high: 410000, decimals: 0 },
      { code: 'rbc', name: 'RBC count', unit: 'million/uL', low: 4.5, high: 5.5, decimals: 2 },
      { code: 'hct', name: 'Hematocrit', unit: '%', low: 40, high: 50, decimals: 1 }
    ]
  },
  hba1c: {
    code: 'hba1c', name: 'HbA1c',
    parameters: [{ code: 'hba1c', name: 'HbA1c', unit: '%', low: 4.0, high: 5.6, decimals: 1 }]
  },
  lipid: {
    code: 'lipid', name: 'Lipid Profile',
    parameters: [
      { code: 'tc', name: 'Total cholesterol', unit: 'mg/dL', low: null, high: 200, decimals: 0 },
      { code: 'hdl', name: 'HDL cholesterol', unit: 'mg/dL', low: 40, high: 60, decimals: 0 },
      { code: 'ldl', name: 'LDL cholesterol', unit: 'mg/dL', low: null, high: 100, decimals: 0 },
      { code: 'tg', name: 'Triglycerides', unit: 'mg/dL', low: null, high: 150, decimals: 0 }
    ]
  },
  tsh: {
    code: 'tsh', name: 'TSH',
    parameters: [{ code: 'tsh', name: 'Thyroid stimulating hormone', unit: 'mIU/L', low: 0.4, high: 4.0, decimals: 2 }]
  },
  vitd: {
    code: 'vitd', name: 'Vitamin D (25-OH)',
    parameters: [{ code: 'vitd', name: '25-OH Vitamin D', unit: 'ng/mL', low: 30, high: 100, decimals: 1 }]
  }
});

export function getCatalogTest(code) {
  return TEST_CATALOG[code] || null;
}

export function listCatalog() {
  return Object.values(TEST_CATALOG).map(t => ({ code: t.code, name: t.name }));
}
