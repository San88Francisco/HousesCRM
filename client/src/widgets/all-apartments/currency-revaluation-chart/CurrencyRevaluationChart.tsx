'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import {
  BAR_RADIUS,
  BAR_SIZE,
  OPACITY_DEFAULT,
  OPACITY_DARK,
  OPACITY_LIGHT,
  TOOLTIP_Z_INDEX,
  formatYAxisTick,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';
import {
  useChartData,
  useChartConfig,
} from '@/hooks/all-apartments/currency-revaluation-chart/hooks';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { CurrencyRevalutionTooltip } from './CurrencyRevalutionTooltip';

export const CurrencyRevaluationChart = () => {
  const { data, isLoading, error } = useGetHousesAnalyticsQuery();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useChartData(data?.currencyRevaluation || []);
  const { xAxisMax, containerHeight, chartHeight, isDark, purchaseBarFill, growthBarFill } =
    useChartConfig(chartData);

  useEffect(() => setMounted(true), []);

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
    <Card className="w-full  mx-auto">
      <CardHeader className="pb-4">
        <CardTitle>Переоцінка валюти</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="w-full no-scrollbar relative" style={{ height: containerHeight }}>
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
                  fill: isDark ? 'var(--dark-light)' : 'var(--dark)',
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                width={110}
              />

              <Tooltip
                content={<CurrencyRevalutionTooltip isDark={isDark} />}
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
