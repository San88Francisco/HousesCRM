import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { AllAnalyticsResponse, HouseChartDataItem } from '@/types/services/all-analitics';

export function addFillToRevenueItems(res: AllAnalyticsResponse): HouseChartDataItem[] {
  return res.revenueDistribution.data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
