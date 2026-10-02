/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  X,
  Copy,
  Check,
  Building2,
  CreditCard,
  Smartphone,
  Users,
  Percent,
  SlidersHorizontal,
  Clock,
  Wallet,
  TrendingDown,
  Calculator,
  RefreshCw,
  Award,
} from 'lucide-react';
import { registerSubscriber, testConnection } from './lib/firebase';

interface HeroBackground {
  id: string;
  name: string;
  location: string;
  url: string;
  tagline: string;
}

const HERO_BACKGROUNDS: HeroBackground[] = [
  {
    id: 'bellagio',
    name: 'The Bellagio Resort & Fountain View Suite',
    location: 'Las Vegas, NV',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85',
    tagline: 'Expedia $389/nt vs Atlas B2B Bedbank $198/nt — 49% Net Price Difference',
  },
  {
    id: 'cancun',
    name: 'Secrets Riviera Oceanfront All-Inclusive',
    location: 'Cancun, Mexico',
    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=2400&q=85',
    tagline: 'Public OTA $510/nt vs Atlas Wholesale $235/nt — 54% Net Price Difference',
  },
  {
    id: 'orlando',
    name: 'Kingdom Bay Family Resort & Waterpark',
    location: 'Orlando, FL',
    url: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=2400&q=85',
    tagline: 'Family suites $129/nt vs $275/nt on Booking.com — 4 Family Passes included',
  },
  {
    id: 'paris',
    name: 'Le Grand Palace Vendôme Deluxe',
    location: 'Paris, France',
    url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=2400&q=85',
    tagline: 'Expedia $620/nt vs Atlas $345/nt — 44% Rate Parity Arbitrage',
  },
];

// Actual destination comparisons from the Atlas Travel Club repository
const REAL_DESTINATIONS = [
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

type TravelerProfile = 'family' | 'frequent' | 'nomad' | 'executive';

interface TravelerPreset {
  id: TravelerProfile;
  title: string;
  subtitle: string;
  defaultTrips: number;
  defaultNights: number;
  avgNightlySpendUSD: number;
  wholesaleSavingsPct: number;
  description: string;
}

const TRAVELER_PRESETS: TravelerPreset[] = [
  {
    id: 'family',
    title: 'Family & Holidays',
    subtitle: 'Summer breaks, school holidays & getaways (4–8 people)',
    defaultTrips: 2,
    defaultNights: 7,
    avgNightlySpendUSD: 450,
    wholesaleSavingsPct: 0.45,
    description: 'Families booking multi-room suites or family resorts bear heavy OTA marketing markups. Direct wholesale bedbanks typically save $150–$250 per night.',
  },
  {
    id: 'frequent',
    title: 'Frequent Voyager',
    subtitle: 'Couples and frequent flyers with 4–6 trips per year',
    defaultTrips: 4,
    defaultNights: 3,
    avgNightlySpendUSD: 360,
    wholesaleSavingsPct: 0.42,
    description: 'Weekend breaks and city stays across 4- and 5-star properties. Eliminating public OTA margins saves over $150/night on premium stays.',
  },
  {
    id: 'nomad',
    title: 'Global Nomad',
    subtitle: 'Remote professionals staying 30+ nights abroad',
    defaultTrips: 3,
    defaultNights: 14,
    avgNightlySpendUSD: 180,
    wholesaleSavingsPct: 0.38,
    description: 'Combines direct wholesale rates on boutique stays and coliving with complimentary 10GB 5G eSIM data and 0% foreign transaction fees.',
  },
  {
    id: 'executive',
    title: 'Luxury & Villas',
    subtitle: 'Private luxury villas, penthouses and five-star retreats',
    defaultTrips: 2,
    defaultNights: 5,
    avgNightlySpendUSD: 850,
    wholesaleSavingsPct: 0.48,
    description: 'High-end hotel suites and private villas sourced directly from institutional bedbanks without $300–$500 nightly retail commissions.',
  },
];

const USD_TO_NOK = 10.5;

export default function App() {
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculator State
  const [calcCurrency, setCalcCurrency] = useState<'USD' | 'NOK'>('USD');
  const [travelerProfile, setTravelerProfile] = useState<TravelerProfile>('family');
  const [tripsPerYear, setTripsPerYear] = useState(2);
  const [nightsPerTrip, setNightsPerTrip] = useState(7);
  const [nightlySpendUSD, setNightlySpendUSD] = useState(450);

  const [submissionResult, setSubmissionResult] = useState<{
    email: string;
    inviteCode: string;
    subscriberId: string;
    timestamp: string;
  } | null>(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    let isMounted = true;
    testConnection()
      .then((connected) => {
        if (isMounted) {
          setConnectionStatus(connected ? 'connected' : 'disconnected');
        }
      })
      .catch(() => {
        if (isMounted) {
          setConnectionStatus('disconnected');
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPreset = (preset: TravelerPreset) => {
    setTravelerProfile(preset.id);
    setTripsPerYear(preset.defaultTrips);
    setNightsPerTrip(preset.defaultNights);
    setNightlySpendUSD(preset.avgNightlySpendUSD);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerSubscriber(email, 'Member Waitlist');
      const payload = {
        email: email.trim().toLowerCase(),
        inviteCode: result.inviteCode,
        subscriberId: result.subscriberId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSubmissionResult(payload);
      setShowEmailModal(true);
      setEmail('');
    } catch (err: unknown) {
      console.error('Subscription error:', err);
      setErrorMessage(
        err instanceof Error && !err.message.includes('{')
          ? err.message
          : 'Unable to save subscription. Please check your network and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInviteCode = () => {
    if (!submissionResult?.inviteCode) return;
    navigator.clipboard.writeText(submissionResult.inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const scrollToWaitlist = () => {
    const input = document.getElementById('email-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus();
    }
  };

  const activeBg = HERO_BACKGROUNDS[activeBgIndex];

  // Dynamic Savings Calculations based on real Rate Parity Arbitrage
  const currentPreset = TRAVELER_PRESETS.find((p) => p.id === travelerProfile) || TRAVELER_PRESETS[0];
  const rateMultiplier = calcCurrency === 'NOK' ? USD_TO_NOK : 1;

  const totalNights = tripsPerYear * nightsPerTrip;
  const standardRetailSpend = totalNights * (nightlySpendUSD * rateMultiplier);
  const directWholesaleSavings = Math.round(standardRetailSpend * currentPreset.wholesaleSavingsPct);
  const atlasCost = standardRetailSpend - directWholesaleSavings;

  const formatCurrency = (amount: number) => {
    if (calcCurrency === 'USD') {
      return `$${amount.toLocaleString('en-US')}`;
    }
    return `${amount.toLocaleString('nb-NO')} NOK`;
  };

  return (
    <div id="landing-page-root" className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between overflow-x-hidden">
      {/* Background Image Layer with Crossfade */}
      <div className="fixed inset-0 z-0 select-none overflow-hidden">
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out transform scale-105 ${
              idx === activeBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${bg.url})`,
            }}
          />
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-neutral-950/90" />
      </div>

      {/* Header / Brand Bar */}
      <header id="main-header" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 md:py-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-neutral-950/60 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-lg shadow-black/40">
            <Compass className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel tracking-[0.22em] text-lg md:text-xl font-bold uppercase text-neutral-100">
                Atlas Travel Club
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300">
                Closed-Loop Access
              </span>
            </div>
            <span className="text-xs tracking-wider text-neutral-400 font-mono">
              atlastravelclub.com • Institutional B2B Bedbank Rates
            </span>
          </div>
        </div>

        {/* Database Status Indicator */}
        <div
          id="database-status-indicator"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-neutral-300"
          title={
            connectionStatus === 'connected'
              ? 'Connected to Firebase Firestore'
              : connectionStatus === 'disconnected'
              ? 'Offline or connecting to Firestore'
              : 'Checking Firestore connection...'
          }
        >
          {connectionStatus === 'connected' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Firestore Connected</span>
            </>
          )}
          {connectionStatus === 'checking' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="hidden sm:inline text-neutral-400">Connecting...</span>
            </>
          )}
          {connectionStatus === 'disconnected' && (
            <>
              <span className="w-2 h-2 rounded-full bg-neutral-500" />
              <span className="hidden sm:inline text-neutral-400">Offline Ready</span>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Content Area */}
      <main id="hero-section" className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-6 md:py-10 max-w-5xl mx-auto w-full text-center">
        {/* Core Concept Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg shadow-black/40 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>B2B Wholesale Bedbanks: Bypass 20%–50% Public Retail Markup</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-100 leading-[1.15] mb-4 max-w-4xl drop-shadow-md">
          Sovereign Travel. <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 bg-clip-text text-transparent">
            Institutional Wholesale Rates for Families & Voyagers.
          </span>
        </h1>

        {/* Subtitle explaining the real model */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed mb-6 drop-shadow">
          When booking through public OTAs like Booking.com or Expedia, you pay a 20% to 50% commission markup that funds TV commercials and search ads. As a private, closed-loop membership club, ATLAS is <strong>100% exempt from Rate Parity restrictions</strong>, connecting members directly to institutional bedbanks (Hotelbeds, WebBeds) at wholesale net rates.
        </p>

        {/* Real Rate Parity Comparison Ticker */}
        <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {REAL_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-left flex flex-col justify-between hover:border-amber-400/40 transition"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                  <span>{dest.name}</span>
                  <span className="text-emerald-400 font-bold">-{dest.savingsPct}%</span>
                </div>
                <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">
                  {dest.resortName}
                </h4>
              </div>
              <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-baseline justify-between text-xs font-mono">
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

        {/* Email Signup Form Container */}
        <div className="w-full max-w-xl mx-auto mb-12">
          <div className="rounded-2xl border border-amber-400/30 bg-neutral-950/85 backdrop-blur-xl p-5 sm:p-7 shadow-2xl shadow-black/80">
            {submissionResult ? (
              /* Success State: Clean, genuine confirmation */
              <div id="subscription-success-card" className="text-left space-y-4">
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-100">
                      Thank You for Joining!
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Email successfully registered in Firestore • Confirmation logged
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <span className="text-neutral-400 block">Registered Email Address:</span>
                  <span className="font-mono text-amber-300 text-sm font-semibold">{submissionResult.email}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    id="open-email-preview-btn"
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>View Welcome Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmissionResult(null)}
                    className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium transition cursor-pointer"
                  >
                    Register Another Email
                  </button>
                </div>
              </div>
            ) : (
              /* Email Signup Form */
              <form id="membership-signup-form" onSubmit={handleSubscribe} className="space-y-4">
                <div className="text-left mb-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Launching Soon
                    </span>
                  </div>
                  <label htmlFor="email-input" className="block text-sm font-bold tracking-wide text-neutral-100 mb-1">
                    Join the Waiting List Now
                  </label>
                  <p className="text-xs text-neutral-400">
                    Atlas Travel Club is launching soon. Secure your invitation now for direct access to wholesale bedbank rates across 1M+ hotels, villas, and luxury resorts.
                  </p>
                </div>

                {/* Main Email Input with Inline Button */}
                <div className="relative flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      disabled={isSubmitting}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-neutral-100 placeholder-neutral-500 text-sm outline-none transition"
                    />
                  </div>

                  <button
                    id="submit-invitation-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-semibold text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-60 cursor-pointer shrink-0"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-neutral-900" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Join the Waiting List Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-left">
                    {errorMessage}
                  </div>
                )}

                {/* Trust Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>Securely stored in Firestore. Zero spam, only launch updates and access.</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ======================================================= */}
        {/* INTERACTIVE SAVINGS CALCULATOR (RATE PARITY ARBITRAGE)  */}
        {/* ======================================================= */}
        <div id="savings-calculator-section" className="w-full max-w-4xl mx-auto text-left mb-14">
          <div className="rounded-2xl border border-amber-400/30 bg-neutral-950/85 backdrop-blur-xl p-5 sm:p-8 shadow-2xl shadow-black/80">
            {/* Header with Currency Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-2">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Rate Parity Savings Engine</span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-neutral-100 uppercase">
                  Calculate Your Real Travel Savings
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Compare public rates on Booking.com/Expedia against direct institutional B2B Bedbank wholesale prices.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-neutral-400 font-mono">Currency:</span>
                <div className="inline-flex p-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setCalcCurrency('USD')}
                    className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${
                      calcCurrency === 'USD'
                        ? 'bg-amber-400 text-neutral-950 shadow'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcCurrency('NOK')}
                    className={`px-3 py-1 rounded transition cursor-pointer font-semibold ${
                      calcCurrency === 'NOK'
                        ? 'bg-amber-400 text-neutral-950 shadow'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    NOK (kr)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 1: Profile Selector Tabs */}
            <div className="pt-6">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300 block mb-3">
                1. Select Traveler Profile:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {TRAVELER_PRESETS.map((preset) => {
                  const isSelected = travelerProfile === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400/15 border-amber-400/70 shadow-lg shadow-amber-400/10'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-100">
                          {preset.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                          {preset.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Insight Banner */}
            <div className="my-5 p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
              <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-neutral-100 font-semibold">Wholesale Advantage: </strong>
                {currentPreset.description}
              </p>
            </div>

            {/* Step 2: Sliders Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 pb-6 border-b border-neutral-800">
              {/* Slider 1: Trips / year */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="trips-slider" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trips per year:</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {tripsPerYear} trips/yr
                  </span>
                </div>
                <input
                  id="trips-slider"
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={tripsPerYear}
                  onChange={(e) => setTripsPerYear(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>1 trip</span>
                  <span>4 trips</span>
                  <span>8 trips</span>
                </div>
              </div>

              {/* Slider 2: Nights per Trip */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="nights-slider" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Avg nights per trip:</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {nightsPerTrip} nights
                  </span>
                </div>
                <input
                  id="nights-slider"
                  type="range"
                  min="2"
                  max="21"
                  step="1"
                  value={nightsPerTrip}
                  onChange={(e) => setNightsPerTrip(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>2 nights</span>
                  <span>7 nights</span>
                  <span>21 nights</span>
                </div>
              </div>

              {/* Slider 3: Average Public Retail Nightly Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="spend-slider" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Public OTA rate per night:</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {formatCurrency(nightlySpendUSD * rateMultiplier)}/nt
                  </span>
                </div>
                <input
                  id="spend-slider"
                  type="range"
                  min="120"
                  max="1200"
                  step="20"
                  value={nightlySpendUSD}
                  onChange={(e) => setNightlySpendUSD(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>{formatCurrency(120 * rateMultiplier)}</span>
                  <span>{formatCurrency(500 * rateMultiplier)}</span>
                  <span>{formatCurrency(1200 * rateMultiplier)}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Comparative Output & Calculated Savings */}
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Baseline Retail Spend */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-left">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Public Retail Cost (Booking/Expedia)
                  </span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-neutral-300 line-through decoration-red-400/60">
                    {formatCurrency(standardRetailSpend)}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Total for {totalNights} nights with retail margins included.
                  </p>
                </div>

                {/* Atlas Wholesale Cost */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-left">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Atlas Wholesale Cost
                  </span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                    {formatCurrency(atlasCost)}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Direct net wholesale price from institutional bedbanks.
                  </p>
                </div>

                {/* Net Savings Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-neutral-950 border border-amber-400/50 text-left shadow-lg">
                  <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block font-bold mb-1">
                    Estimated Net Savings
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-200">
                    {formatCurrency(directWholesaleSavings)}
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    Direct cash saved on your accommodation.
                  </p>
                </div>
              </div>

              {/* Action Banner inside Calculator */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30">
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-neutral-100">
                    Ready to unlock wholesale rates on your next journey?
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Register your email address above to gain early access.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={scrollToWaitlist}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-semibold text-xs transition cursor-pointer shrink-0 shadow-lg shadow-amber-500/20"
                >
                  <span>Join the Waiting List Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Highlights / Genuine Club Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full">
          <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/80 backdrop-blur-md text-left">
            <Building2 className="w-4 h-4 text-amber-300 mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              1M+ Wholesale Hotels
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Direct integration into Hotelbeds, WebBeds, and institutional wholesale inventory.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/80 backdrop-blur-md text-left">
            <Users className="w-4 h-4 text-amber-300 mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              4 Family Passes
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Share membership access with spouse, children, or travel companions at zero extra cost.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/80 backdrop-blur-md text-left">
            <Smartphone className="w-4 h-4 text-amber-300 mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              5G Global eSIM
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Worldwide roaming data packages across 160+ countries included for international travel.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/80 backdrop-blur-md text-left">
            <CreditCard className="w-4 h-4 text-amber-300 mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              0% Foreign FX Fees
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-snug">
              Atlas Visa card with zero foreign transaction fees on international spending.
            </p>
          </div>
        </div>
      </main>

      {/* Hero Background Switcher & Location Badge Bar */}
      <footer id="main-footer" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 border-t border-neutral-900/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Featured: <strong className="text-neutral-200">{activeBg.name}</strong> ({activeBg.location})
          </span>
          <span className="hidden md:inline text-neutral-500">— {activeBg.tagline}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-500 hidden sm:inline">Explore stays:</span>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900/70 border border-neutral-800 backdrop-blur-md">
            {HERO_BACKGROUNDS.map((bg, index) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => setActiveBgIndex(index)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  activeBgIndex === index
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title={bg.name}
              >
                {bg.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <span>&copy; 2026 Atlas Travel Club • atlastravelclub.com</span>
        </div>
      </footer>

      {/* ======================================================= */}
      {/* TRIGGERED WELCOME CONFIRMATION EMAIL MODAL PREVIEW      */}
      {/* ======================================================= */}
      {showEmailModal && submissionResult && (
        <div
          id="welcome-email-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            id="welcome-email-preview-container"
            className="w-full max-w-lg bg-neutral-900 border border-amber-400/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header Bar */}
            <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                    Confirmation Logged
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Delivered
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    To: <span className="text-neutral-200 font-mono">{submissionResult.email}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Body Preview Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left bg-neutral-900 text-neutral-200">
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs font-mono space-y-1 text-neutral-400">
                <div>
                  <span className="text-neutral-500">From: </span>
                  <span className="text-neutral-300">Atlas Travel Club &lt;invitations@atlastravelclub.com&gt;</span>
                </div>
                <div>
                  <span className="text-neutral-500">To: </span>
                  <span className="text-neutral-200">{submissionResult.email}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Subject: </span>
                  <span className="text-amber-300 font-semibold">Welcome to Atlas Travel Club | Early Access Confirmation</span>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed border-t border-neutral-800 pt-4">
                <p>
                  Hello,
                </p>
                <p>
                  Thank you for joining the early access list for <strong>Atlas Travel Club</strong>.
                </p>
                <p className="text-xs text-neutral-300">
                  We are creating a private membership club providing direct access to institutional wholesale bedbanks across 1M+ hotels, resorts, and private villas — eliminating the typical 20% to 50% public retail commission markups.
                </p>

                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs text-neutral-400 block font-mono">Your Reference Code:</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base text-amber-300 font-bold tracking-wider">
                      {submissionResult.inviteCode}
                    </span>
                    <button
                      type="button"
                      onClick={copyInviteCode}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 pt-2">
                  You will be notified as soon as member onboarding begins.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Stored in Firestore Database</span>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
