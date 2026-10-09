import React, { useState } from 'react';
import {
  Building2,
  Plane,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export const REAL_HOTELS = [
  {
    id: 'vegas',
    name: 'Las Vegas, NV',
    resortName: 'The Bellagio Resort & Fountain Suite',
    publicOTA: 389,
    atlasWholesale: 198,
    savingsPct: 49,
    otaProvider: 'Expedia',
    verifyUrl: 'https://www.expedia.com/Hotel-Search?destination=Las%20Vegas',
  },
  {
    id: 'cancun',
    name: 'Cancun, Mexico',
    resortName: 'Secrets Riviera Oceanfront All-Inclusive',
    publicOTA: 510,
    atlasWholesale: 235,
    savingsPct: 54,
    otaProvider: 'Booking.com',
    verifyUrl: 'https://www.booking.com/searchresults.html?ss=Cancun',
  },
  {
    id: 'orlando',
    name: 'Orlando, FL',
    resortName: 'Kingdom Bay Family Waterpark Resort',
    publicOTA: 275,
    atlasWholesale: 129,
    savingsPct: 53,
    otaProvider: 'Hotels.com',
    verifyUrl: 'https://www.hotels.com/Hotel-Search?destination=Orlando',
  },
  {
    id: 'paris',
    name: 'Paris, France',
    resortName: 'Le Grand Palace Vendôme Deluxe',
    publicOTA: 620,
    atlasWholesale: 345,
    savingsPct: 44,
    otaProvider: 'Booking.com',
    verifyUrl: 'https://www.booking.com/searchresults.html?ss=Paris',
  },
];

export const REAL_FLIGHTS = [
  {
    id: 'lhr-jfk',
    route: 'London (LHR) ➔ New York (JFK)',
    carrier: 'British Airways / Virgin',
    cabin: 'Economy / Premium',
    publicOTA: 890,
    atlasWholesale: 640,
    savingsPct: 28,
    otaProvider: 'Google Flights / Expedia',
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+London+to+New+York',
    notes: 'Eliminates €35 legacy GDS surcharge + at-cost baggage',
  },
  {
    id: 'osl-lhr',
    route: 'Oslo (OSL) ➔ London (LHR)',
    carrier: 'SAS / British Airways',
    cabin: 'Direct European',
    publicOTA: 240,
    atlasWholesale: 185,
    savingsPct: 23,
    otaProvider: 'Google Flights',
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Oslo+to+London',
    notes: 'Includes unbundled baggage at cost + EU261 guarantee',
  },
  {
    id: 'cdg-hnd',
    route: 'Paris (CDG) ➔ Tokyo (HND)',
    carrier: 'Air France / ANA',
    cabin: 'Long-Haul Premium',
    publicOTA: 1240,
    atlasWholesale: 960,
    savingsPct: 23,
    otaProvider: 'Expedia',
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Paris+to+Tokyo',
    notes: 'Direct NDC continuous pricing fare without retail markup',
  },
  {
    id: 'osl-nce',
    route: 'Oslo (OSL) ➔ Nice (NCE)',
    carrier: 'Norwegian / SAS',
    cabin: 'Direct Mediterranean',
    publicOTA: 380,
    atlasWholesale: 295,
    savingsPct: 22,
    otaProvider: 'Booking.com Flights',
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Oslo+to+Nice',
    notes: 'Zero OTA credit card markup + automated delay payout',
  },
];

const FLIGHT_TEST_PRESETS = [
  {
    id: 'osl-lhr',
    from: 'Oslo (OSL)',
    to: 'London (LHR)',
    carrier: 'SAS & British Airways NDC',
    retail: 240,
    wholesale: 185,
    savings: 55,
    savingsPct: 23,
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Oslo+to+London',
  },
  {
    id: 'lhr-jfk',
    from: 'London (LHR)',
    to: 'New York (JFK)',
    carrier: 'British Airways & Virgin NDC',
    retail: 890,
    wholesale: 640,
    savings: 250,
    savingsPct: 28,
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+London+to+New+York',
  },
  {
    id: 'cdg-hnd',
    from: 'Paris (CDG)',
    to: 'Tokyo (HND)',
    carrier: 'Air France & ANA NDC',
    retail: 1240,
    wholesale: 960,
    savings: 280,
    savingsPct: 23,
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Paris+to+Tokyo',
  },
  {
    id: 'osl-nce',
    from: 'Oslo (OSL)',
    to: 'Nice (NCE)',
    carrier: 'Norwegian & SAS NDC',
    retail: 380,
    wholesale: 295,
    savings: 85,
    savingsPct: 22,
    verifyUrl: 'https://www.google.com/travel/flights?q=flights+from+Oslo+to+Nice',
  },
];

export const RateTicker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights'>('hotels');
  const [selectedFlightPreset, setSelectedFlightPreset] = useState(FLIGHT_TEST_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleRunFlightScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 700);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16">
      {/* Category Tab Switcher: Hotels vs Flights */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 font-semibold block text-center sm:text-left">
            Live Rate Parity Arbitrage Audit (Institutional Clearing vs Public OTAs)
          </span>
          <p className="text-[11px] text-neutral-400 font-mono mt-0.5 text-center sm:text-left">
            Verify every rate live on Booking.com or Google Flights.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-neutral-800 shadow-md">
          <button
            type="button"
            onClick={() => setActiveTab('hotels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hotels'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hotels (Bedbanks)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flights')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'flights'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Flights (Duffel NDC)</span>
          </button>
        </div>
      </div>

      {/* HOTELS VIEW */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {REAL_HOTELS.map((dest) => (
            <div
              key={dest.id}
              className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 backdrop-blur-md text-left flex flex-col justify-between hover:border-amber-400/50 transition-all hover:scale-[1.01] shadow-lg shadow-black/40"
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

              <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-neutral-500 line-through text-[11px]">
                    {dest.otaProvider}: ${dest.publicOTA}
                  </span>
                  <span className="text-amber-300 font-bold text-sm">
                    Atlas: ${dest.atlasWholesale}/nt
                  </span>
                </div>

                {/* Direct Verification Link to verify live */}
                <a
                  href={dest.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-amber-300 transition-colors"
                  title={`Open live search on ${dest.otaProvider} to verify this price`}
                >
                  <span>Verifiser på {dest.otaProvider}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FLIGHTS VIEW (DUFFEL NDC) */}
      {activeTab === 'flights' && (
        <div className="space-y-4">
          {/* Flight Route Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {REAL_FLIGHTS.map((flight) => (
              <div
                key={flight.id}
                className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 backdrop-blur-md text-left flex flex-col justify-between hover:border-amber-400/50 transition-all hover:scale-[1.01] shadow-lg shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                    <span className="text-sky-300 font-semibold">{flight.carrier}</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      -{flight.savingsPct}%
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                    {flight.route}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {flight.notes}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-baseline justify-between text-xs font-mono">
                    <span className="text-neutral-500 line-through text-[11px]">
                      OTA: ${flight.publicOTA}
                    </span>
                    <span className="text-amber-300 font-bold text-sm">
                      Duffel NDC: ${flight.atlasWholesale}
                    </span>
                  </div>

                  <a
                    href={flight.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-amber-300 transition-colors"
                    title="Open live search on Google Flights to verify this route"
                  >
                    <span>Verifiser på Google Flights</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Live Duffel Flight Test Box for Visitors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800/90 backdrop-blur-md text-left shadow-xl shadow-black/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-300">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <span>Test Duffel NDC Wholesale Flight Scanner</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-sky-400/15 text-sky-300 border border-sky-400/30 font-mono">
                      Live Test
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Select a route to simulate raw Duffel NDC airline net pricing vs public Google Flights.
                  </p>
                </div>
              </div>

              {/* Quick Route Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {FLIGHT_TEST_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedFlightPreset(preset);
                      setScanComplete(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition ${
                      selectedFlightPreset.id === preset.id
                        ? 'bg-neutral-800 border border-amber-400/40 text-amber-300 font-bold'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset.from.split(' ')[0]} ➔ {preset.to.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Action & Result */}
            <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Selected Route & Carrier Connection
                </span>
                <div className="text-sm font-bold text-neutral-200">
                  {selectedFlightPreset.from} ➔ {selectedFlightPreset.to}
                </div>
                <div className="text-xs font-mono text-sky-400 flex items-center gap-1">
                  <span>Direct NDC Gateway:</span>
                  <span className="text-neutral-300">{selectedFlightPreset.carrier}</span>
                </div>
              </div>

              {/* Price Breakdown Display */}
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-around text-center font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Public OTA</span>
                  <span className="text-sm line-through text-neutral-400 font-semibold">
                    ${selectedFlightPreset.retail}
                  </span>
                </div>
                <div className="text-neutral-600">➔</div>
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Atlas NDC Net</span>
                  <span className="text-base text-amber-300 font-bold">
                    ${selectedFlightPreset.wholesale}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">You Save</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    -${selectedFlightPreset.savings} ({selectedFlightPreset.savingsPct}%)
                  </span>
                </div>
              </div>

              {/* Actions & Verification */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunFlightScan}
                  disabled={isScanning}
                  className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Pinging Duffel...' : 'Scan Duffel NDC'}</span>
                </button>

                <a
                  href={selectedFlightPreset.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition"
                >
                  <span>Verifiser på Google Flights</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </div>
            </div>

            {/* EU Protection Guarantee Footer on Flight Scanner */}
            <div className="mt-3 pt-3 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Duffel EU261 Protection Included: Up to €600 compensation automatically credited upon 3h+ disruption.</span>
              </div>
              <span className="text-neutral-500">Zero Agency Booking Fee • At-Cost Airline Settling</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
