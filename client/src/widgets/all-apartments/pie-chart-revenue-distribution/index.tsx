'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';

import { addFillToRevenueItems } from '@/shared/utils/pie-chart/add-fill-pie-revenue-items';

import { PieChartRevenue } from './PieChartRevenue';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';

export function ChartPieDonutText() {
  const { data } = useGetHousesAnalyticsQuery();

  if (!data?.revenueDistribution.data) return null;

  const grandApartmentTotalRevenue = data.revenueDistribution.grandTotal;
  const adjustedData = addFillToRevenueItems(data);

  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader className="items-center pb-0 mb-5">
        <CardTitle>Загальний дохід по всіх квартирах</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
