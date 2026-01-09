'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { formatYAxis } from '@/shared/utils/all-house/payback-chart/payback';
import { cn } from '@/shared/utils/cn';

import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';

import {
  useChartDimensions,
  useChartScroll,
  usePaybackChartData,
} from '../../../shared/utils/all-house/payback-chart/utils';
import { CustomBar } from './CustomBar';
import { CustomXAxisTick } from './CustomXAxisTick';
import { PaybackChartTooltip } from './PaybackChartTooltip';

const CHART_HEIGHT = 300;
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 50 };

export const PaybackChart = () => {
  const [mounted, setMounted] = useState(false);

  const { data: analyticsData, isLoading, error } = useGetHousesAnalyticsQuery();

  const chartData = usePaybackChartData(analyticsData?.housesPaybackStats);
  const { yAxisMax, yAxisMin, minChartWidth, scaleType } = useChartDimensions(chartData);
  const { scrollRef, isDragging, handlePointerDown, handlePointerMove } = useChartScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chartData?.length) return <EmptyState />;

  const yAxisDomain: [number | string, number | string] = [yAxisMin, yAxisMax];

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
            'payback-chart-wrapper',
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div style={{ minWidth: `${minChartWidth}px` }}>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart data={chartData} margin={CHART_MARGIN} barSize={20}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="apartmentName"
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomXAxisTick />}
                  interval={0}
                />
                <YAxis
                  scale={scaleType}
                  domain={yAxisDomain}
                  tickFormatter={value => formatYAxis(value, 'USD')}
                  axisLine={false}
                  tickLine={false}
                  width={65}
                  allowDataOverflow={false}
                  tick={{
                    fontSize: 12,
                    fill: 'var(--text)',
                    fontWeight: 500,
                  }}
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
