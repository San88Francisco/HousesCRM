'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';

import { addFillToRevenueItems } from '@/shared/utils/pie-chart/add-fill-pie-revenue-items';

import { PieChartRevenue } from './PieChartRevenue';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';

export function ChartPieDonutText() {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();

  if (isLoading) return <LoadingState className="max-w-[600px]" />;
  if (error) return <ErrorState error={error} className="max-w-[600px]" />;
  if (!data?.revenueDistribution.data?.length) return <EmptyState className="max-w-[600px]" />;

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
