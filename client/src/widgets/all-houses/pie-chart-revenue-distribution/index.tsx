'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { addFillToChartItems } from '@/shared/utils/all-house/add-fill-to-charts-items';
import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';
import { ChartPieDonutTextSkeleton } from '@/widgets/skeletons/chart-pie-donut-text-skeleton';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ChartList } from './ChartList';
import { PieChartRevenue } from './PieChartRevenue';

export function ChartPieDonutText() {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();

  useEffect(() => {
    if (error) {
      toast.error('Невдалось завантажити загальний дохід по всіх квартирах');
    }
  }, [error]);

  if (isLoading) return <ChartPieDonutTextSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!data?.revenueDistribution.data?.length) return <EmptyState />;

  const grandApartmentTotalRevenue = data.revenueDistribution.grandTotal;
  const adjustedData = addFillToChartItems(data, 'revenueDistribution');

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0 mb-10">
        <div className="flex flex-col gap-3">
          <CardTitle>Загальний дохід по всіх квартирах</CardTitle>
          <CardDescription>
            Діаграма показує внесок кожної квартири у загальний дохід
          </CardDescription>
        </div>
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
