import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';

type WithFill<T> = T & { fill: string };

type ChartKey = 'revenueDistribution' | 'housesOverview' | 'currencyRevaluation' | 'housesPayback';

type ChartMap = {
  revenueDistribution: AllAnalyticsResponse['revenueDistribution']['data'];
  housesOverview: AllAnalyticsResponse['housesOverview'];
  currencyRevaluation: AllAnalyticsResponse['currencyRevaluation'];
  housesPayback: AllAnalyticsResponse['housesPaybackStats'];
};

export function addFillToChartItems<K extends ChartKey>(
  res: AllAnalyticsResponse,
  chart: K,
): WithFill<ChartMap[K][number]>[] {
  const dataMap: Record<ChartKey, readonly unknown[]> = {
    revenueDistribution: res.revenueDistribution.data,
    housesOverview: res.housesOverview,
    currencyRevaluation: res.currencyRevaluation,
    housesPayback: res.housesPaybackStats,
  };

  return (dataMap[chart] as ChartMap[K]).map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
