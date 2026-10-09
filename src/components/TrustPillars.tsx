import React from 'react';
import { Building2, Users, Smartphone, CreditCard } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-100">
          The Atlas Membership Advantage
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Everything included with private club access for families and voyagers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            1M+ Wholesale Hotels
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Direct integration into Hotelbeds, WebBeds, and institutional inventory without public OTA markups.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            4 Family Passes
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Share full membership wholesale access with spouse, adult children, or companions at zero extra fee.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            5G Global eSIM
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            International roaming data across 160+ countries included directly on your smartphone.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            0% Foreign FX Fees
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Atlas Visa card with real interbank exchange rates and zero foreign transaction commissions.
          </p>
        </div>
      </div>
    </section>
  );
};
