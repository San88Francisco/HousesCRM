import { Apartment } from '../core/line-chart';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];

  revenueDistribution: RevenueDistribution;

  housesPaybackStats: HousePaybackStat[];

  currencyRevaluation: CurrencyRevaluationItem[];

  housesPerformance: HousesPerformance;
  meta: HousesPerformanceMeta;
};

export interface RevenueDistribution {
  data: RevenueDistributionItem[];
  grandTotal: number;
}

export interface RevenueDistributionItem {
  apartmentTotalRevenue: number;
  percentage: number;
  id: string;
  apartmentName: string;
}

export interface HousePaybackStat {
  purchasePriceUSD: number;
  totalIncomeUSD: number;
  paybackCoefficient: number;
  id: string;
  apartmentName: string;
  purchaseDate: string;
}

export interface CurrencyRevaluationItem {
  purchaseRate: number;
  currentRate: number;
  revaluationAmountUah: number;
  purchaseAmountUah: number;
  id: string;
  apartmentName: string;
}

export interface HousesPerformance {
  data: HousePerformanceItem[];
  meta: HousesPerformanceMeta;
}

export interface HousePerformanceItem {
  apartmentName: string;
  rentersCount: number;
  totalRevenue: number;
  currentPayment: number;
}

export interface HousesPerformanceMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
