import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { HouseChartDataItem } from '@/types/core/chart-pie-item';
import { HousesAllAnalyticsResponse, RevenueItem } from '@/types/services/houses';

const MIN_PERCENT = 0.02;

/** Нормалізує дані, щоб сильно маленьке значення не губилось серед великих в Pie Chart */
export function normalizeChartData(data: HouseChartDataItem[]): HouseChartDataItem[] {
  const total = data.reduce((sum, d) => sum + d.apartmentTotalRevenue, 0);

  return data.map(d => ({
    ...d,
    apartmentTotalRevenue: Math.max(d.apartmentTotalRevenue, total * MIN_PERCENT),
  }));
}

export function mapRevenueToChartData(items: RevenueItem[]): HouseChartDataItem[] {
  return items.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));
}

export function getChartDataFromResponse(res: HousesAllAnalyticsResponse) {
  const withFill = mapRevenueToChartData(res.revenueDistribution.data);
  const normalized = normalizeChartData(withFill);

  return normalized;
}
