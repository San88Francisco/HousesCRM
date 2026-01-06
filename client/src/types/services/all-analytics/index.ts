import { CurrencyRevaluation } from '../../core/currency-revaluation-chart';
import { HousePaybackStat } from '../../core/house-payback';
import { HousesPerformanceResponse } from '../../core/houses-performance';
import { RevenueDistribution } from '../../core/revenue-distribution/chart-pie-item';
import { Apartment } from '../../model/houses-overview';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];
  revenueDistribution: RevenueDistribution;
  housesPaybackStats: HousePaybackStat[];
  currencyRevaluation: CurrencyRevaluation[];
  housesPerformance: HousesPerformanceResponse;
};
