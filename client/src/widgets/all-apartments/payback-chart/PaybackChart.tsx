'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { cn } from '@/shared/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { CustomBar } from './CustomBar';
import { CustomXAxisTick } from './CustomXAxisTick';
import { usePaybackChartData, useChartDimensions, useChartScroll } from './utils';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { formatYAxis } from '@/shared/utils/all-apartments/payback-chart/payback';
import { PaybackChartTooltip } from './PaybackChartTooltip';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';

const CHART_HEIGHT = 250;

export const PaybackChart = () => {
  const [mounted, setMounted] = useState(false);

  const { data: analyticsData, isLoading, error } = useGetHousesAnalyticsQuery();

  const chartData = usePaybackChartData(analyticsData?.housesPaybackStats);
  const { yAxisMax, minChartWidth } = useChartDimensions(chartData);
  const {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useChartScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chartData || chartData.length === 0) return <EmptyState />;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Статистика окупності квартир
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2 sm:p-4 md:p-6">
        <div
          ref={scrollRef}
          className={cn(
            'overflow-x-auto overflow-y-hidden',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
            'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200',
            'dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800',
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div style={{ minWidth: `${minChartWidth}px` }}>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
                barSize={20}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} strokeWidth={1} />
                <XAxis
                  dataKey="apartmentName"
                  height={10}
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomXAxisTick />}
                  interval={0}
                />
                <YAxis
                  domain={[0, yAxisMax]}
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12, fill: 'var(--text)', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<PaybackChartTooltip />} cursor={false} />
                <Bar dataKey="purchasePriceUSD" shape={<CustomBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
