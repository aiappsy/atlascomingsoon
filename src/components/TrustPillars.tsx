import React from 'react';
import { Building2, Plane, ShieldCheck, Users } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-100">
          The Atlas Membership Advantage
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Wholesale hotel bedbanks, direct airline flights, and complete European travel protection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Hotels */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            1M+ Wholesale Hotels
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Direct access to institutional hotel bedbanks (Hotelbeds, WebBeds) without the 20%–50% markups charged by Booking.com and Expedia.
          </p>
        </div>

        {/* Pillar 2: Duffel NDC Flights */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-3">
            <Plane className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            300+ Airlines via Duffel NDC
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Direct airline API connections with carriers like British Airways, SAS, Lufthansa, and Emirates at pure net cost with zero booking fees.
          </p>
        </div>

        {/* Pillar 3: EU Travel Protection & EU261 */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            Duffel EU Travel Protection
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Automated EU261 compensation up to €600 per passenger for flight delays, plus statutory European package travel insolvency protection.
          </p>
        </div>

        {/* Pillar 4: 4 Family Passes */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            4 Family &amp; Companion Passes
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Share full wholesale access with your partner, family members, or travel companions at zero extra fee on your annual membership.
          </p>
        </div>
      </div>
    </section>
  );
};
