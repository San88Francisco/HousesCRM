import {
  HouseDistributionChartDataItem,
  RevenueDistribution,
} from '../core/revenue-distribution/chart-pie-item';

import { HousePaybackChartDataItem, HousePaybackStat } from '../core/house-payback/types';

import { HousesPerformanceResponse } from '../core/houses-performance/types';
import { Apartment, HouseOverviewChartDataItem } from '../core/houses-overview/types';
import {
  CurrencyRevaluation,
  CurrencyRevaluationChartDataItem,
} from '../core/currency-revaluation-chart/types';

export type AllAnalyticsResponse = {
  housesOverview: Apartment[];

  revenueDistribution: RevenueDistribution;

  housesPaybackStats: HousePaybackStat[];

  currencyRevaluation: CurrencyRevaluation[];

  housesPerformance: HousesPerformanceResponse;
};

export type HouseChartDataItem =
  | CurrencyRevaluationChartDataItem
  | HousePaybackChartDataItem
  | HouseOverviewChartDataItem
  | HouseDistributionChartDataItem;
