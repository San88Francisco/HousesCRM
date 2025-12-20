import { ChartPieConfig } from '@/types/core/revenue-distribution/chart-pie-config';
import { HouseDistributionChartDataItem } from '@/types/core/revenue-distribution/chart-pie-item';

export function createChartPieConfig(data: HouseDistributionChartDataItem[]): ChartPieConfig {
  const entries = data.map((item, index) => [
    index,
    {
      label: item.apartmentName,
      color: item.fill,
    },
  ]);

  return Object.fromEntries(entries) as ChartPieConfig;
}
