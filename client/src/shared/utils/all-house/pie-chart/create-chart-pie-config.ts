import { PieConfigChart } from '@/types/core/revenue-distribution/chart-pie-config';
import { HouseDistributionDataItemChart } from '@/types/model/revenue-distribution';

export const createChartPieConfig = (data: HouseDistributionDataItemChart[]): PieConfigChart => {
  const entries = data.map((item, index) => [
    index,
    {
      label: item.apartmentName,
      color: item.fill,
    },
  ]);

  return Object.fromEntries(entries) as PieConfigChart;
};
