import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';

export const addFillToRevenueItems = (res: AllAnalyticsResponse) => {
  return res.revenueDistribution.data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
};
