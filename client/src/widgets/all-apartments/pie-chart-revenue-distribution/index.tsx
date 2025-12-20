'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';
import { PieChartRevenue } from './PieChartRevenue';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { addFillToChartItems } from '@/shared/utils/all-apartments/add-fill-to-charts-items';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';

export function ChartPieDonutText() {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data?.revenueDistribution.data?.length) return <EmptyState />;

  const grandApartmentTotalRevenue = data.revenueDistribution.grandTotal;
  const adjustedData = addFillToChartItems(data, 'revenueDistribution');

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0 mb-10">
        <CardTitle>Загальний дохід по всіх квартирах</CardTitle>
      </CardHeader>
      <CardContent className="flex   gap-10 items-center ">
        <PieChartRevenue
          grandApartmentTotalRevenue={grandApartmentTotalRevenue}
          adjustedData={adjustedData}
        />
        <ChartList chartData={adjustedData} />
      </CardContent>
    </Card>
  );
}
