export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NOK';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number;
  suffix?: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateFromUSD: 1 },
  EUR: { code: 'EUR', symbol: '€', rateFromUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rateFromUSD: 0.78 },
  NOK: { code: 'NOK', symbol: 'kr ', rateFromUSD: 10.5, suffix: ' NOK' },
};

export type StayTierId = 'boutique' | 'premium' | 'luxury' | 'villa';
export type FlightClass = 'none' | 'economy' | 'business';

export interface StayTier {
  id: StayTierId;
  name: string;
  subtitle: string;
  publicRateUSD: number;
  wholesaleRateUSD: number;
  savingsPct: number;
}

export const STAY_TIERS: StayTier[] = [
  {
    id: 'boutique',
    name: 'Boutique & 3–4 Star',
    subtitle: 'Charming city stays, design hotels & lifestyle properties',
    publicRateUSD: 190,
    wholesaleRateUSD: 140,
    savingsPct: 26,
  },
  {
    id: 'premium',
    name: '4-Star Premium',
    subtitle: 'Full-service hotels, business properties & beach resorts',
    publicRateUSD: 320,
    wholesaleRateUSD: 230,
    savingsPct: 28,
  },
  {
    id: 'luxury',
    name: '5-Star Luxury',
    subtitle: 'Five-star resorts, iconic landmark hotels & spa retreats',
    publicRateUSD: 550,
    wholesaleRateUSD: 385,
    savingsPct: 30,
  },
  {
    id: 'villa',
    name: 'Suites & Private Villas',
    subtitle: 'Multi-room penthouses, luxury estates & serviced villas',
    publicRateUSD: 950,
    wholesaleRateUSD: 645,
    savingsPct: 32,
  },
];

export interface CalculationInput {
  tripsPerYear: number;
  nightsPerTrip: number;
  peopleTravelling: number;
  tierId: StayTierId;
  currency: CurrencyCode;
  includeFlights?: boolean;
  flightClass?: FlightClass;
}

export interface CalculationResult {
  totalNights: number;
  totalFlightTickets: number;
  roomMultiplier: number;
  retailTotal: number;
  wholesaleTotal: number;
  hotelSavings: number;
  flightSavings: number;
  annualSavings: number;
  savingsPercentage: number;
  equivalentNights: number;
  equivalentFlights: number;
  formattedRetail: string;
  formattedWholesale: string;
  formattedSavings: string;
  formattedHotelSavings: string;
  formattedFlightSavings: string;
}

export function getRoomMultiplier(people: number): number {
  if (people <= 2) return 1.0;
  if (people <= 4) return 1.6; // Family suite / 2 connected rooms
  if (people <= 6) return 2.3; // Multi-room or 2.5 rooms
  return 3.0; // 3+ rooms or private villa
}

export function formatCurrencyValue(amount: number, currency: CurrencyCode): string {
  const conf = CURRENCIES[currency];
  const rounded = Math.round(amount);
  if (currency === 'NOK') {
    return `${rounded.toLocaleString('nb-NO')}${conf.suffix || ' NOK'}`;
  }
  return `${conf.symbol}${rounded.toLocaleString('en-US')}`;
}

export function calculateSavings(input: CalculationInput): CalculationResult {
  const tier = STAY_TIERS.find((t) => t.id === input.tierId) || STAY_TIERS[1];
  const curr = CURRENCIES[input.currency];
  const multiplier = getRoomMultiplier(input.peopleTravelling);
  const totalNights = input.tripsPerYear * input.nightsPerTrip;

  // 1. Hotel Calculations
  const hotelRetailUSD = totalNights * tier.publicRateUSD * multiplier;
  const hotelWholesaleUSD = totalNights * tier.wholesaleRateUSD * multiplier;
  const hotelSavingsUSD = hotelRetailUSD - hotelWholesaleUSD;

  // 2. Flight Calculations (Realistic, honest figures)
  const flightClass = input.includeFlights !== false ? (input.flightClass || 'economy') : 'none';
  const totalFlightTickets = flightClass !== 'none' ? input.tripsPerYear * input.peopleTravelling : 0;

  let flightRetailUSD = 0;
  let flightWholesaleUSD = 0;
  let flightSavingsUSD = 0;

  if (flightClass === 'economy') {
    // Realistic: $480 retail (with bags/fees) vs $400 Duffel NDC net (saves $80/ticket = ~17%)
    flightRetailUSD = totalFlightTickets * 480;
    flightWholesaleUSD = totalFlightTickets * 400;
    flightSavingsUSD = totalFlightTickets * 80;
  } else if (flightClass === 'business') {
    // Realistic: $1,950 retail vs $1,480 Duffel NDC net (saves $470/ticket = ~24%)
    flightRetailUSD = totalFlightTickets * 1950;
    flightWholesaleUSD = totalFlightTickets * 1480;
    flightSavingsUSD = totalFlightTickets * 470;
  }

  // Combined Totals
  const retailTotalUSD = hotelRetailUSD + flightRetailUSD;
  const wholesaleTotalUSD = hotelWholesaleUSD + flightWholesaleUSD;
  const annualSavingsUSD = hotelSavingsUSD + flightSavingsUSD;

  // Converted to active currency
  const retailTotal = retailTotalUSD * curr.rateFromUSD;
  const wholesaleTotal = wholesaleTotalUSD * curr.rateFromUSD;
  const annualSavings = annualSavingsUSD * curr.rateFromUSD;
  const hotelSavings = hotelSavingsUSD * curr.rateFromUSD;
  const flightSavings = flightSavingsUSD * curr.rateFromUSD;

  const savingsPercentage = Math.round((annualSavings / Math.max(1, retailTotal)) * 100);
  const equivalentNights = Math.round(annualSavingsUSD / tier.wholesaleRateUSD);
  const equivalentFlights = Math.max(1, Math.floor(annualSavingsUSD / 400));

  return {
    totalNights,
    totalFlightTickets,
    roomMultiplier: multiplier,
    retailTotal,
    wholesaleTotal,
    hotelSavings,
    flightSavings,
    annualSavings,
    savingsPercentage,
    equivalentNights,
    equivalentFlights,
    formattedRetail: formatCurrencyValue(retailTotal, input.currency),
    formattedWholesale: formatCurrencyValue(wholesaleTotal, input.currency),
    formattedSavings: formatCurrencyValue(annualSavings, input.currency),
    formattedHotelSavings: formatCurrencyValue(hotelSavings, input.currency),
    formattedFlightSavings: formatCurrencyValue(flightSavings, input.currency),
  };
}
