import { ChartPieConfig } from '@/types/core/chart-pie-config';
import { HouseChartDataItem } from '@/types/core/chart-pie-item';

export function createChartPieConfig(data: HouseChartDataItem[]): ChartPieConfig {
  const entries = data.map((item, index) => [
    index,
    {
      label: item.apartmentName,
      color: item.fill,
    },
  ]);

  return Object.fromEntries(entries) as ChartPieConfig;
}
