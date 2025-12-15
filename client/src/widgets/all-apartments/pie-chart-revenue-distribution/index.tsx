'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';
import { addFillToRevenueItems } from '@/shared/utils/all-apartments/pie-chart/add-fill-pie-revenue-items';
import { PieChartRevenue } from './PieChartRevenue';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';

export function ChartPieDonutText() {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();

  if (isLoading) {
    return <LoadingState className="max-w-[600px]" />;
  }

  if (error) {
    return <ErrorState error={error} className="max-w-[600px]" />;
  }

  if (!data?.revenueDistribution?.data || data.revenueDistribution.data.length === 0) {
    return <EmptyState className="max-w-[600px]" />;
  }

  const grandApartmentTotalRevenue = data.revenueDistribution.grandTotal;
  const adjustedData = addFillToRevenueItems(data);

  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader className="items-center pb-0">
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
