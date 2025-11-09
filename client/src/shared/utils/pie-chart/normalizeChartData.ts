import { ChartDataItem } from '@/types/core/chart-item';

const MIN_PERCENT = 0.02;

/** Нормалізує дані, щоб сильно маленьке значення не губилось серед великих в Pie Chart */
export function normalizeChartData(data: ChartDataItem[]): ChartDataItem[] {
  const total = data.reduce((sum, d) => sum + d.apartmentTotalRevenue, 0);

  return data.map(d => ({
    ...d,
    apartmentTotalRevenue: Math.max(d.apartmentTotalRevenue, total * MIN_PERCENT),
  }));
}
