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
}

export interface CalculationResult {
  totalNights: number;
  roomMultiplier: number;
  retailTotal: number;
  wholesaleTotal: number;
  annualSavings: number;
  savingsPercentage: number;
  equivalentNights: number;
  equivalentFlights: number;
  formattedRetail: string;
  formattedWholesale: string;
  formattedSavings: string;
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

  const retailTotalUSD = totalNights * tier.publicRateUSD * multiplier;
  const wholesaleTotalUSD = totalNights * tier.wholesaleRateUSD * multiplier;
  const annualSavingsUSD = retailTotalUSD - wholesaleTotalUSD;

  const retailTotal = retailTotalUSD * curr.rateFromUSD;
  const wholesaleTotal = wholesaleTotalUSD * curr.rateFromUSD;
  const annualSavings = annualSavingsUSD * curr.rateFromUSD;

  const savingsPercentage = Math.round((annualSavings / retailTotal) * 100);
  const equivalentNights = Math.round(annualSavingsUSD / tier.wholesaleRateUSD);
  const equivalentFlights = Math.max(1, Math.floor(annualSavingsUSD / 450));

  return {
    totalNights,
    roomMultiplier: multiplier,
    retailTotal,
    wholesaleTotal,
    annualSavings,
    savingsPercentage,
    equivalentNights,
    equivalentFlights,
    formattedRetail: formatCurrencyValue(retailTotal, input.currency),
    formattedWholesale: formatCurrencyValue(wholesaleTotal, input.currency),
    formattedSavings: formatCurrencyValue(annualSavings, input.currency),
  };
}
