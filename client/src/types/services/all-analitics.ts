import { CurrencyRevaluation } from '../core/currency-revaluation-chart/types';
import { HousePaybackStat } from '../core/house-payback/types';
import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { RevenueDistribution } from '../core/revenue-distribution/chart-pie-item';
import { Apartment } from '../model/houses-overview/types';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];
  revenueDistribution: RevenueDistribution;
  housesPaybackStats: HousePaybackStat[];
  currencyRevaluation: CurrencyRevaluation[];
  housesPerformance: HousesPerformanceResponse;
};
