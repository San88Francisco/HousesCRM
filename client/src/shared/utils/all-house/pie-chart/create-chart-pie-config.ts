import { ChartPieConfig } from '@/types/core/revenue-distribution/chart-pie-config';
import { HouseDistributionChartDataItem } from '@/types/model/revenue-distribution/pie-chart-items';

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
