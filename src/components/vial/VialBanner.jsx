import React from 'react';
import { SYNTHETIC_BANNER } from './vialService.js';

export const VialBanner = () => (
  <div role="note" className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
    {SYNTHETIC_BANNER}
  </div>
);
