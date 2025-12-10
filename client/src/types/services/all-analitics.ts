import { RevenueDistribution } from '../core/revenue-distribution/chart-pie-item';
import { Apartment } from '../core/revenue-distribution-chart';
import { HousePaybackStat } from '../core/house-payback/types';

import { HousesPerformance, HousesPerformanceMeta } from '../core/houses-performance/types';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];

  revenueDistribution: RevenueDistribution;

  housesPaybackStats: HousePaybackStat[];

  currencyRevaluation: HousePaybackStat[];

  housesPerformance: HousesPerformance;
  meta: HousesPerformanceMeta;
};
