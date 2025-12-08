import { PIE_COLORS } from '@/constants/revenue-pie-chart/chart-pie-colors';
import { ChartPieConfig } from '@/types/core/chart-pie-config';
import { PieRevenueItem } from '@/types/core/chart-pie-item';

export function createChartPieConfig(data: PieRevenueItem[]): ChartPieConfig {
  const entries = data.map((item, index) => [
    index,
    {
      label: item.apartmentName,
      color: PIE_COLORS[index % PIE_COLORS.length],
    },
  ]);

  return Object.fromEntries(entries) as ChartPieConfig;
}
