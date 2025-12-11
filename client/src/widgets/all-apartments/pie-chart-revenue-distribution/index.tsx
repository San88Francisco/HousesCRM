'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';

import { addFillToRevenueItems } from '@/shared/utils/pie-chart/add-fill-pie-revenue-items';
import { useGetHousesAnalyticsQuery } from '@/store/houses';
import { PieChartRevenue } from './PieChartRevenue';

export function ChartPieDonutText() {
  const { data } = useGetHousesAnalyticsQuery();

  if (!data?.revenueDistribution.data) return null;

  const grandApartmentTotalRevenue = data.revenueDistribution.grandTotal;
  const adjustedData = addFillToRevenueItems(data);

  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader className="items-center pb-0 mb-10">
        <CardTitle>Загальний дохід по всіх квартирах</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <PieChartRevenue
          grandApartmentTotalRevenue={grandApartmentTotalRevenue}
          adjustedData={adjustedData}
        />
        <ChartList chartData={adjustedData} />
      </CardContent>
    </Card>
  );
}
