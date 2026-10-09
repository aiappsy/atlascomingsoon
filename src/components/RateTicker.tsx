import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const REAL_DESTINATIONS = [
  {
    id: 'vegas',
    name: 'Las Vegas, NV',
    resortName: 'The Bellagio Resort & Fountain Suite',
    publicOTA: 389,
    atlasWholesale: 198,
    savingsPct: 49,
    otaProvider: 'Expedia',
  },
  {
    id: 'cancun',
    name: 'Cancun, Mexico',
    resortName: 'Secrets Riviera Oceanfront All-Inclusive',
    publicOTA: 510,
    atlasWholesale: 235,
    savingsPct: 54,
    otaProvider: 'Booking.com',
  },
  {
    id: 'orlando',
    name: 'Orlando, FL',
    resortName: 'Kingdom Bay Family Waterpark Resort',
    publicOTA: 275,
    atlasWholesale: 129,
    savingsPct: 53,
    otaProvider: 'Hotels.com',
  },
  {
    id: 'paris',
    name: 'Paris, France',
    resortName: 'Le Grand Palace Vendôme Deluxe',
    publicOTA: 620,
    atlasWholesale: 345,
    savingsPct: 44,
    otaProvider: 'Expedia',
  },
];

export const RateTicker: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12">
      <div className="text-center mb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 font-semibold">
          Live Rate Parity Arbitrage Audit (B2B Bedbanks vs Public OTAs)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REAL_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 backdrop-blur-md text-left flex flex-col justify-between hover:border-amber-400/50 transition-all hover:scale-[1.02] shadow-lg shadow-black/40"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                <span>{dest.name}</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  -{dest.savingsPct}%
                </span>
              </div>
              <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                {dest.resortName}
              </h4>
            </div>
            <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-baseline justify-between text-xs font-mono">
              <span className="text-neutral-500 line-through text-[11px]">
                {dest.otaProvider}: ${dest.publicOTA}
              </span>
              <span className="text-amber-300 font-bold text-sm">
                Atlas: ${dest.atlasWholesale}/nt
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
