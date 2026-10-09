import React from 'react';
import { Building2, Plane, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';

export const TrustPillars: React.FC = () => {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-100">
          The Atlas Membership Advantage
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Wholesale bedbanks, direct airline NDC networks, and European insolvency protection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pillar 1: Hotels */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            1M+ Wholesale Hotels
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Direct integration into Hotelbeds, WebBeds, and institutional inventory without public OTA markups (20%–50% net savings).
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
            Direct carrier connections (BA, Lufthansa, SAS, Emirates). Bypass legacy GDS retail markups with unbundled net fares and continuous pricing.
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
            Automated EU261 flight disruption compensation (up to €600 payout per passenger) plus statutory EU &amp; Norwegian RGF package travel insolvency guarantee.
          </p>
        </div>

        {/* Pillar 4: Zero FX */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            0% Foreign FX Fees
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Atlas Visa card with real interbank exchange rates and zero foreign transaction commissions across 40+ currencies.
          </p>
        </div>

        {/* Pillar 5: Family & eSIM */}
        <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-left hover:border-amber-400/40 transition sm:col-span-2 lg:col-span-2">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-100">
            5G Global eSIM &amp; 4 Family Passes Included
          </h4>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Share full wholesale access with family or companions at zero extra fee, plus instant high-speed 5G mobile roaming in 160+ countries directly on your device.
          </p>
        </div>
      </div>
    </section>
  );
};
