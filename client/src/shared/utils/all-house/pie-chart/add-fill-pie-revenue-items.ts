import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart/chart-pie-colors';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';

export function addFillToRevenueItems(res: AllAnalyticsResponse) {
  return res.revenueDistribution.data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}
