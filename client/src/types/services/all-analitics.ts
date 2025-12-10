import { RevenueDistribution } from '../core/revenue-distribution/chart-pie-item';
import { Apartment } from '../core/revenue-distribution-chart';
import { HousePaybackStat } from '../core/house-payback/house-payback';
import { CurrencyRevaluationItem } from '../core/currency-revaluation/currency-revaluation';
import {
  HousesPerformance,
  HousesPerformanceMeta,
} from '../core/houses-performance/houses-performance';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];

  revenueDistribution: RevenueDistribution;

  housesPaybackStats: HousePaybackStat[];

  currencyRevaluation: CurrencyRevaluationItem[];

  housesPerformance: HousesPerformance;
  meta: HousesPerformanceMeta;
};
