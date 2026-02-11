import { CurrencyRevaluation } from '../../core/currency-revaluation-chart';
import { HousePaybackStat } from '../../core/house-payback';
import { RevenueDistribution } from '../../core/revenue-distribution/chart-pie-item';
import { Apartment } from '../../model/houses-overview';
import { HousesPerformanceResponse } from '../houses';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];
  revenueDistribution: RevenueDistribution;
  housesPaybackStats: HousePaybackStat[];
  currencyRevaluation: CurrencyRevaluation[];
  housesPerformance: HousesPerformanceResponse;
};
