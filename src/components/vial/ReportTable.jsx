import React from 'react';
import { getCatalog } from './vialService.js';

// Shows value, unit and the lab's reference range only. No flags, colours or interpretation.
export const ReportTable = ({ results }) => {
  const names = Object.fromEntries(getCatalog().map(t => [t.code, t.name]));
  return (
    <div className="space-y-3">
      {results.map(r => (
        <div key={r.testCode} className="rounded-xl border border-[#E8EAE7] overflow-hidden">
          <div className="bg-[#F4F6F3] px-3 py-2 text-xs font-bold text-[#18231C]">{names[r.testCode] || r.testCode}</div>
          <div className="divide-y divide-[#E8EAE7]">
            {r.parameters.map(p => (
              <div key={p.code} className="px-3 py-2 text-xs grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5">
                <span className="font-semibold text-[#18231C]">{p.name}</span>
                <span className="font-bold text-[#18231C] text-right">{p.value} {p.unit}</span>
                <span className="text-[#5C6E63]">Reference range</span>
                <span className="text-[#5C6E63] text-right">{p.reference?.text} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
