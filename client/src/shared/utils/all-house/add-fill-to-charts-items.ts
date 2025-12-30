import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart/chart-pie-colors';
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
  res: Partial<AllAnalyticsResponse>,
  chart: K,
): WithFill<ChartMap[K][number]>[] {
  const dataExtractors: Record<
    ChartKey,
    (r: Partial<AllAnalyticsResponse>) => readonly unknown[] | undefined
  > = {
    revenueDistribution: r => r.revenueDistribution?.data,
    housesOverview: r => r.housesOverview,
    currencyRevaluation: r => r.currencyRevaluation,
    housesPayback: r => r.housesPaybackStats,
  };

  const data = dataExtractors[chart](res);

  if (!data) return [];

  return (data as ChartMap[K]).map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
