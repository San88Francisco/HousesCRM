import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { HouseDistributionChartDataItem } from '@/types/core/revenue-distribution/chart-pie-item';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';

export function addFillToRevenueItems(res: AllAnalyticsResponse): HouseDistributionChartDataItem[] {
  return res.revenueDistribution.data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
