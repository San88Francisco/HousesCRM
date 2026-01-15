'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { formatYAxis } from '@/shared/utils/all-house/payback-chart/payback';
import { cn } from '@/shared/utils/cn';
import { Currencies } from '@/types/core/currencies';

import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';

import {
  useChartDimensions,
  useChartScroll,
  usePaybackChartData,
} from '@/shared/utils/all-house/payback-chart/utils';
import { CustomBar } from './CustomBar';
import { LegendContent } from './LegendContent';
import { PaybackChartTooltip } from './PaybackChartTooltip';

const CHART_HEIGHT = 300;
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 30 };
const LEGEND_MARGIN_TOP = -70;
const LEGEND_HEIGHT = 80;
const CHART_CURRENCY: Currencies = 'UAH';

type ChartCoordinatesProps = {
  yAxis?: {
    scale?: {
      ticks?: (count: number) => number[];
      (value: number): number;
    };
  };
};

export const PaybackChart = () => {
  const [mounted, setMounted] = useState(false);
  const [activeApartment, setActiveApartment] = useState<string | null>(null);

  const { data: analyticsData, isLoading, error } = useGetHousesAnalyticsQuery();

  const chartData = usePaybackChartData(analyticsData?.housesPaybackStats, CHART_CURRENCY);
  const { yAxisMax, yAxisMin, minChartWidth, scaleType } = useChartDimensions(chartData);
  const { scrollRef, isDragging, handlePointerDown, handlePointerMove } = useChartScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApartmentClick = (id: string) => {
    setActiveApartment(prev => (prev === id ? null : id));
  };

  const filteredChartData = activeApartment
    ? chartData.filter(item => item.id === activeApartment)
    : chartData;

  const horizontalCoordinatesGenerator = useCallback(
    (props: ChartCoordinatesProps) => {
      const { yAxis } = props;
      if (!yAxis?.scale) return [];

      const { scale } = yAxis;
      const ticks = scale.ticks?.(6) ?? [];

      return ticks.filter((tick: number) => tick < yAxisMax).map((tick: number) => scale(tick));
    },
    [yAxisMax],
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chartData?.length) return <EmptyState />;
  if (!mounted) return null;

  const yAxisDomain: [number | string, number | string] = [yAxisMin, yAxisMax];
  const totalChartHeight = CHART_HEIGHT + LEGEND_HEIGHT;
  const chartMarginWithLegend = { ...CHART_MARGIN, bottom: LEGEND_HEIGHT };

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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <div style={{ minWidth: `${minChartWidth}px` }}>
            <ResponsiveContainer width="100%" height={totalChartHeight}>
              <BarChart data={filteredChartData} margin={chartMarginWithLegend} barSize={20}>
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="0"
                  vertical={false}
                  horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
                />
                <XAxis dataKey="apartmentName" hide />
                <YAxis
                  scale={scaleType}
                  domain={yAxisDomain}
                  tickFormatter={value => formatYAxis(value, CHART_CURRENCY)}
                  axisLine={false}
                  tickLine={false}
                  width={65}
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

            <div
              className="relative pointer-events-auto"
              style={{ marginTop: LEGEND_MARGIN_TOP, zIndex: 10 }}
              onPointerDown={e => e.stopPropagation()}
              onPointerMove={e => e.stopPropagation()}
            >
              <LegendContent
                apartmentsData={chartData}
                activeApartment={activeApartment}
                onApartmentClick={handleApartmentClick}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
