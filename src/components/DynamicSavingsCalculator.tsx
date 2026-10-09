import React, { useState } from 'react';
import {
  Calculator,
  Clock,
  Users,
  Building,
  ArrowRight,
  Sparkles,
  Plane,
  Bed,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  CurrencyCode,
  StayTierId,
  FlightClass,
  STAY_TIERS,
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
  const [includeFlights, setIncludeFlights] = useState<boolean>(true);
  const [flightClass, setFlightClass] = useState<FlightClass>('economy');

  // Animation pulse state when calculating
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Perform calculation
  const result = calculateSavings({
    tripsPerYear,
    nightsPerTrip,
    peopleTravelling,
    tierId,
    currency,
    includeFlights,
    flightClass,
  });

  // Trigger slight visual pulse when values change
  const handleInputChange = () => {
    setIsAnimating(true);
    if (onCalculationTrigger) onCalculationTrigger();
    setTimeout(() => setIsAnimating(false), 300);
  };

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
              <span>Wholesale Travel Savings Calculator</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wide text-neutral-100">
              Your Annual Travel Savings
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Calculate what you save across wholesale hotel bedbanks and Duffel NDC commercial flights compared to public retail portals.
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

        {/* Accommodation Style Selector */}
        <div className="pt-6 pb-4">
          <label className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300 block mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>1. Hotel Accommodation Style:</span>
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
                      ? 'bg-amber-400/15 border-amber-400/80 shadow-lg shadow-amber-400/10 scale-[1.01]'
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

        {/* Flights Option Selector */}
        <div className="pt-2 pb-4">
          <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-100 block">
                  2. Include Duffel NDC Commercial Flights in Estimate:
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Direct airline net fares without retail markups or legacy booking surcharges.
                </span>
              </div>
            </div>

            {/* Flight Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setIncludeFlights(false);
                  setFlightClass('none');
                  handleInputChange();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                  !includeFlights
                    ? 'bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Hotels Only
              </button>

              <button
                type="button"
                onClick={() => {
                  setIncludeFlights(true);
                  setFlightClass('economy');
                  handleInputChange();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                  includeFlights && flightClass === 'economy'
                    ? 'bg-sky-400 text-neutral-950 font-bold shadow-md shadow-sky-400/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:text-white'
                }`}
              >
                Economy (~15% Net Save)
              </button>

              <button
                type="button"
                onClick={() => {
                  setIncludeFlights(true);
                  setFlightClass('business');
                  handleInputChange();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                  includeFlights && flightClass === 'business'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:text-white'
                }`}
              >
                Business (~24% Net Save)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Main Sliders: Travels, Nights, People */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-8 border-b border-neutral-800">
          {/* 1. Travels / Trips per year */}
          <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="trips-input" className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Trips per year:</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                {tripsPerYear} {tripsPerYear === 1 ? 'trip' : 'trips'}
              </span>
            </div>

            <input
              id="trips-input"
              type="range"
              min="1"
              max="12"
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
                <span>Travelers:</span>
              </label>
              <span className="text-xs font-mono font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800">
                {peopleTravelling} {peopleTravelling === 1 ? 'traveler' : 'travelers'}
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
            <div className="md:col-span-6 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Cost Breakdown ({result.totalNights} Hotel Nights {includeFlights ? `+ ${result.totalFlightTickets} Flight Tickets` : ''}):
              </span>

              {/* Public Retail Cost Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide block">
                    Public Retail (Booking.com / Expedia / Public OTAs)
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-neutral-400 line-through decoration-red-400/80">
                    {result.formattedRetail}
                  </div>
                </div>
                <div className="text-right text-[11px] text-neutral-500 font-mono">
                  Includes ~{result.savingsPercentage}% markups &amp; fees
                </div>
              </div>

              {/* Atlas Wholesale Cost Bar */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-amber-400/40 flex items-center justify-between shadow-lg shadow-black/40">
                <div>
                  <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wide block font-semibold">
                    Atlas Member Price (Pure Net Cost)
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
                    {result.formattedWholesale}
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-amber-300 font-bold">
                  Wholesale Net
                </div>
              </div>

              {/* Detailed Breakdown Tags: Hotels vs Flights */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-300 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Hotels Saved:</span>
                  </div>
                  <span className="text-amber-300 font-bold">{result.formattedHotelSavings}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-300 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Flights Saved:</span>
                  </div>
                  <span className="text-sky-300 font-bold">
                    {includeFlights ? result.formattedFlightSavings : '$0'}
                  </span>
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
                  Pure savings kept in your bank account every year instead of paying commercial OTA markups.
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

        {/* The Honest Breakdown Box: How Flight Savings Work */}
        <div className="mt-8 pt-6 border-t border-neutral-800 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold text-neutral-200">
              How Flight Savings Work (The Honest Breakdown)
            </h4>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed mb-4">
            Airlines operate on thin overall margins, so unlike hotels (which easily save 25%–50%), flight savings are more disciplined. Here is exactly where the money is saved:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-bold text-amber-300 block mb-1">1. Zero GDS Surcharges</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Airlines add $15–$35 per ticket on public sites to cover legacy systems (Amadeus/Sabre). Through Duffel NDC, members connect directly to airline APIs without these penalty fees.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-bold text-sky-300 block mb-1">2. At-Cost Luggage &amp; Seats</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Public booking sites often mark up checked baggage by 30%–50%. With Atlas, you pay the airline's direct cost—saving $30–$70 per traveler on baggage alone.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-bold text-emerald-300 block mb-1">3. Automated EU261 Guarantee</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                If your flight is delayed by 3+ hours or cancelled, our Duffel integration automatically monitors the flight and secures up to €600 per passenger directly into your account.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <span className="font-bold text-neutral-200 block mb-1">4. Realistic Expectations</span>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                We believe in complete honesty: expect 8%–14% net savings on typical economy routes, and 18%–26% on long-haul business class fares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
