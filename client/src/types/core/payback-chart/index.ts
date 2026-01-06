export interface HousePaybackStats {
  purchasePriceUSD: number;
  totalIncomeUSD: number;
  paybackCoefficient: number;
  id: string;
  apartmentName: string;
  purchaseDate: string;
}

export interface HousesAnalyticsResponse {
  housesOverview: unknown[];
  revenueDistribution: unknown;
  housesPaybackStats: HousePaybackStats[];
  currencyRevaluation: unknown[];
  housesPerformance: unknown;
}

export interface PaybackChartData {
  id: string;
  apartmentName: string;
  paybackCoefficient: number;
  displayCoefficient: number;
  isFullyPaidBack: boolean;
  color: string;
  purchaseDate: string;
  purchasePriceUSD: number;
  totalIncomeUSD: number;
}
