import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { HouseChartDataItem } from '@/types/core/chart-pie-item';
import { HousesAllAnalyticsResponse } from '@/types/services/houses';

export function addFillToRevenueItems(res: HousesAllAnalyticsResponse): HouseChartDataItem[] {
  return res.revenueDistribution.data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
