'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ChartList } from './ChartList';
import { addFillToRevenueItems } from '@/shared/utils/all-apartments/pie-chart/add-fill-pie-revenue-items';
import { useGetHousesAnalyticsQuery } from '@/store/houses';
import { PieChartRevenue } from './PieChartRevenue';
import { EmptyState, ErrorState, LoadingState } from '../currency-revaluation-chart/ChartStates';

export function ChartPieDonutText() {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();

  // Стан завантаження
  if (isLoading) {
    return <LoadingState />;
  }

  // Стан помилки
  if (error) {
    return <ErrorState error={error} />;
  }

  // Стан відсутності даних
  if (!data?.revenueDistribution?.data || data.revenueDistribution.data.length === 0) {
    return <EmptyState />;
  }

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
