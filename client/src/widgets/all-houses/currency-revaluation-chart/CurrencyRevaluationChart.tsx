'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { useToastOnError } from '@/hooks';
import { useChartConfig, useChartData } from '@/hooks/all-house/currency-revaluation-chart';
import { useHouseColors } from '@/hooks/all-house/house-colors';
import {
  BAR_RADIUS,
  BAR_SIZE,
  GROWTH_ANIMATION_DURATION,
  OPACITY_DARK,
  OPACITY_LIGHT,
  OPACITY_PURCHASE,
  OPACITY_PURCHASE_HOVER,
  PURCHASE_ANIMATION_DURATION,
  formatYAxisTick,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { getHouseColor } from '@/shared/utils/all-house/house-color';
import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';
import { CurrencyRevaluationChartSkeleton } from '@/widgets/skeletons/currency-revaluation-chart-skeleton';
import { CurrencyRevaluationTooltip } from './CurrencyRevaluationTooltip';

export const CurrencyRevaluationChart = () => {
  const { data, isLoading, error, isError } = useGetHousesAnalyticsQuery();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartData = useChartData(data?.currencyRevaluation || []);
  const { xAxisMax, containerHeight, chartHeight, isDark } = useChartConfig(chartData);
  const houseColors = useHouseColors();

  useEffect(() => setMounted(true), []);

  useToastOnError(isError, 'Не вдалось завантажити переоцінку валюти', 'CurrencyRevaluationChart');

  if (isLoading || !mounted) return <CurrencyRevaluationChartSkeleton />;
  if (isError) return <ErrorState error={error} />;
  if (chartData.length === 0) return <EmptyState />;

  const renderCells = (segment: string, getOpacity: (index: number) => number) =>
    chartData.map((item, index) => (
      <Cell
        key={`${segment}-${item.id}`}
        fill={getHouseColor(houseColors, item.id)}
        opacity={getOpacity(index)}
        className="transition-opacity duration-200 ease-in-out"
      />
    ));

  const getPurchaseOpacity = (index: number) =>
    hoveredIndex === index ? OPACITY_PURCHASE_HOVER : OPACITY_PURCHASE;

  const getGrowthOpacity = (index: number) =>
    hoveredIndex === index ? 1 : isDark ? OPACITY_DARK : OPACITY_LIGHT;

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle>Переоцінка валюти</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          ref={chartContainerRef}
          className="w-full overflow-y-auto overflow-x-hidden no-scrollbar relative"
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
                  fontSize: 14,
                  fill: isDark ? 'var(--dark-light)' : 'var(--dark)',
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                width={110}
              />

              <Tooltip
                content={<CurrencyRevaluationTooltip chartContainerRef={chartContainerRef} />}
                cursor={{ fill: 'transparent' }}
                wrapperStyle={{ outline: 'none' }}
              />

              <Bar
                dataKey="purchaseAmount"
                stackId="a"
                radius={[BAR_RADIUS, 0, 0, BAR_RADIUS]}
                barSize={BAR_SIZE}
                isAnimationActive
                animationDuration={PURCHASE_ANIMATION_DURATION}
                animationBegin={0}
              >
                {renderCells('purchase', getPurchaseOpacity)}
              </Bar>

              <Bar
                dataKey="growthAmount"
                stackId="a"
                radius={[0, BAR_RADIUS, BAR_RADIUS, 0]}
                barSize={BAR_SIZE}
                isAnimationActive
                animationDuration={GROWTH_ANIMATION_DURATION}
                animationBegin={PURCHASE_ANIMATION_DURATION}
              >
                {renderCells('growth', getGrowthOpacity)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
