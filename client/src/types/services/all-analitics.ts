import { RevenueDistribution } from '../core/revenue-distribution/chart-pie-item';

import { HousePaybackStat } from '../core/house-payback/types';

import { HousesPerformance, HousesPerformanceMeta } from '../core/houses-performance/types';
import { Apartment } from '../core/houses-overview/types';
import { CurrencyRevaluation } from '../core/currency-revaluation-chart/types';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];

  revenueDistribution: RevenueDistribution;

  housesPaybackStats: HousePaybackStat[];

  currencyRevaluation: CurrencyRevaluation[];

  housesPerformance: HousesPerformance;
  meta: HousesPerformanceMeta;
};
