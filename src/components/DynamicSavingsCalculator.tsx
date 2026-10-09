import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Calendar,
  Clock,
  Users,
  Building,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Plane,
  Bed,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  CurrencyCode,
  StayTierId,
  STAY_TIERS,
  CURRENCIES,
  calculateSavings,
  CalculationResult,
} from '../lib/calculatorModel';

interface DynamicSavingsCalculatorProps {
  onUnlockSavings: (savings: CalculationResult) => void;
  onCalculationTrigger?: () => void;
}

export const DynamicSavingsCalculator: React.FC<DynamicSavingsCalculatorProps> = ({
  onUnlockSavings,
  onCalculationTrigger,
}) => {
  // Visitor inputs
  const [tripsPerYear, setTripsPerYear] = useState<number>(3);
  const [nightsPerTrip, setNightsPerTrip] = useState<number>(5);
  const [peopleTravelling, setPeopleTravelling] = useState<number>(2);
  const [tierId, setTierId] = useState<StayTierId>('premium');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Animation pulse state when calculating
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Perform calculation
  const result = calculateSavings({
    tripsPerYear,
    nightsPerTrip,
    peopleTravelling,
    tierId,
    currency,
  });

  // Trigger slight visual pulse when values change
  const handleInputChange = () => {
    setIsAnimating(true);
    if (onCalculationTrigger) onCalculationTrigger();
    setTimeout(() => setIsAnimating(false), 400);
  };

  const selectedTier = STAY_TIERS.find((t) => t.id === tierId) || STAY_TIERS[1];

  return (
    <div
      id="visual-savings-calculator"
      className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16"
    >
      <div className="relative rounded-3xl border border-amber-400/40 bg-neutral-950/85 backdrop-blur-2xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Subtle Ambient Glow inside Card */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Currency Switcher */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-2">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Dynamic Rate Parity Calculator</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-neutral-100">
              Your Annual Travel Savings
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Model your global journeys. Based on audited B2B bedbank wholesale inventory (25%–32% net margin difference versus public OTA retail portals).
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-neutral-900/90 p-1.5 rounded-xl border border-neutral-800">
            <span className="text-[11px] font-mono text-neutral-400 pl-2">Currency:</span>
            {(['USD', 'EUR', 'GBP', 'NOK'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCurrency(c);
                  handleInputChange();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                  currency === c
                    ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Style Selector Tabs */}
        <div className="pt-6 pb-2">
          <label className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300 block mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>1. Choose Travel Accommodation Style:</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {STAY_TIERS.map((tier) => {
              const isSelected = tier.id === tierId;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    setTierId(tier.id);
                    handleInputChange();
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400/80 shadow-lg shadow-amber-400/10 scale-[1.02]'
                      : 'bg-neutral-900/60 border-neutral-800/90 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-100">
                        {tier.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                        -{tier.savingsPct}%
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {tier.subtitle}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>Retail ~${tier.publicRateUSD}/nt</span>
                    <span className="text-amber-300 font-bold">Atlas ${tier.wholesaleRateUSD}/nt</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Main Sliders: Travels, Nights, People */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-8 border-b border-neutral-800">
          {/* 1. Travels / Trips per year */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="trips-input" className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Travels per year:</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                {tripsPerYear} {tripsPerYear === 1 ? 'trip' : 'trips'} / yr
              </span>
            </div>

            <input
              id="trips-input"
              type="range"
              min="1"
              max="10"
              step="1"
              value={tripsPerYear}
              onChange={(e) => {
                setTripsPerYear(Number(e.target.value));
                handleInputChange();
              }}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Quick chips */}
            <div className="flex justify-between gap-1 pt-1">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setTripsPerYear(num);
                    handleInputChange();
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition ${
                    tripsPerYear === num
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {num} {num === 1 ? 'Trip' : 'Trips'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Nights per trip */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="nights-input" className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Avg nights per trip:</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                {nightsPerTrip} nights
              </span>
            </div>

            <input
              id="nights-input"
              type="range"
              min="2"
              max="21"
              step="1"
              value={nightsPerTrip}
              onChange={(e) => {
                setNightsPerTrip(Number(e.target.value));
                handleInputChange();
              }}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Quick chips */}
            <div className="flex justify-between gap-1 pt-1">
              {[3, 7, 10, 14].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setNightsPerTrip(num);
                    handleInputChange();
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition ${
                    nightsPerTrip === num
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {num}n
                </button>
              ))}
            </div>
          </div>

          {/* 3. Number of people travelling */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="people-input" className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>People travelling:</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                {peopleTravelling} {peopleTravelling === 1 ? 'person' : 'people'}
              </span>
            </div>

            <input
              id="people-input"
              type="range"
              min="1"
              max="8"
              step="1"
              value={peopleTravelling}
              onChange={(e) => {
                setPeopleTravelling(Number(e.target.value));
                handleInputChange();
              }}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            {/* Quick chips */}
            <div className="flex justify-between gap-1 pt-1">
              {[
                { label: 'Solo', val: 1 },
                { label: 'Couple', val: 2 },
                { label: 'Family (4)', val: 4 },
                { label: 'Group (6)', val: 6 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    setPeopleTravelling(item.val);
                    handleInputChange();
                  }}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition ${
                    peopleTravelling === item.val
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Visualizer & Result Presentation */}
        <div className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Column: Side-by-side Comparative Bars */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Cost Breakdown for {result.totalNights} Total Nights / Year:
              </span>

              {/* Public OTA Cost Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide block">
                    Public Portals (Expedia / Booking.com)
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-neutral-400 line-through decoration-red-400/80">
                    {result.formattedRetail}
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-500 font-mono">
                  Includes ~{result.savingsPercentage}% retail markup
                </div>
              </div>

              {/* Atlas B2B Wholesale Cost Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-amber-400/40 flex items-center justify-between shadow-lg shadow-black/40">
                <div>
                  <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wide block font-semibold">
                    Atlas Wholesale Member Price
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                    {result.formattedWholesale}
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-amber-300 font-bold">
                  B2B Bedbank Net
                </div>
              </div>

              {/* Tangible Value Tags */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-300 flex items-center gap-2 font-mono">
                  <Bed className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>≈ {result.equivalentNights} Extra Free Nights</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-300 flex items-center gap-2 font-mono">
                  <Plane className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Covers ~{result.equivalentFlights} Flights</span>
                </div>
              </div>
            </div>

            {/* Right Column: Heroic Annual Savings Callout */}
            <div className="md:col-span-6 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-neutral-950 border border-amber-400/60 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    Total Estimated Annual Savings
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Save ~{result.savingsPercentage}% Net
                  </span>
                </div>

                <div
                  className={`text-4xl sm:text-5xl md:text-6xl font-cinzel font-bold text-amber-200 transition-all duration-300 ${
                    isAnimating ? 'scale-105 filter brightness-125' : 'scale-100'
                  }`}
                >
                  {result.formattedSavings}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                  Cash kept in your account instead of paying commercial advertising markups on public hotel search engines.
                </p>
              </div>

              {/* CTA Action Inside Calculator */}
              <div className="relative z-10 pt-6 mt-4 border-t border-amber-400/30">
                <button
                  type="button"
                  onClick={() => onUnlockSavings(result)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Lock In Wholesale Access for {result.totalNights} Nights</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
