'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { useChartConfig, useChartData } from '@/hooks/all-house/currency-revaluation-chart/hooks';
import {
  BAR_RADIUS,
  BAR_SIZE,
  formatYAxisTick,
  GROWTH_ANIMATION_DURATION,
  OPACITY_DARK,
  OPACITY_DEFAULT,
  OPACITY_LIGHT,
  PURCHASE_ANIMATION_DURATION,
  TOOLTIP_Z_INDEX,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';
import { CurrencyRevaluationTooltip } from './CurrencyRevaluationTooltip';

export const CurrencyRevaluationChart = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: analyticsData, isLoading, error } = useGetHousesAnalyticsQuery();

  const chartData = useChartData(analyticsData?.currencyRevaluation || []);
  const { xAxisMax, containerHeight, chartHeight, isDark, purchaseBarFill, growthBarFill } =
    useChartConfig(chartData);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (chartData.length === 0) return <EmptyState />;

  const renderCells = (fill: string, customOpacity?: (index: number) => number) =>
    chartData.map((_, index) => (
      <Cell
        key={`${fill}-${index}`}
        fill={fill}
        opacity={customOpacity ? customOpacity(index) : 1}
        className="transition-opacity duration-200 ease-in-out"
      />
    ));

  const getGrowthOpacity = (index: number) =>
    hoveredIndex === index ? 1 : isDark ? OPACITY_DARK : OPACITY_LIGHT;

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle>Переоцінка валюти</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className="w-full relative max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
          style={{ height: containerHeight }}
        >
          <ResponsiveContainer width="100%" height={chartHeight} minWidth={280}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              onMouseMove={state => {
                if (state.activeTooltipIndex !== undefined) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <XAxis type="number" domain={[0, xAxisMax]} hide />

              <YAxis
                type="category"
                dataKey="apartmentName"
                tickFormatter={formatYAxisTick}
                tick={{
                  fontSize: 13,
                  fill: isDark ? 'var(--white)' : 'var(--dark)',
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                width={110}
              />

              <Tooltip
                content={<CurrencyRevaluationTooltip />}
                cursor={{ fill: 'transparent' }}
                wrapperStyle={{ outline: 'none', zIndex: TOOLTIP_Z_INDEX }}
                allowEscapeViewBox={{ x: true, y: true }}
              />

              <Bar
                dataKey="purchaseAmount"
                stackId="a"
                radius={[BAR_RADIUS, 0, 0, BAR_RADIUS]}
                barSize={BAR_SIZE}
                fill={purchaseBarFill}
                isAnimationActive
                animationDuration={PURCHASE_ANIMATION_DURATION}
              >
                {renderCells(purchaseBarFill, index =>
                  hoveredIndex === index ? 1 : OPACITY_DEFAULT,
                )}
              </Bar>

              <Bar
                dataKey="growthAmount"
                stackId="a"
                radius={[0, BAR_RADIUS, BAR_RADIUS, 0]}
                barSize={BAR_SIZE}
                fill={growthBarFill}
                isAnimationActive
                animationDuration={GROWTH_ANIMATION_DURATION}
                animationBegin={PURCHASE_ANIMATION_DURATION}
              >
                {renderCells(growthBarFill, getGrowthOpacity)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
