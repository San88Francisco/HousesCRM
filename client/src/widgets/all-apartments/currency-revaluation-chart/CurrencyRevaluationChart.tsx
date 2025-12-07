'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CustomTooltip } from './CustomTooltip';
import { useGetCurrencyRevaluationQuery } from '@/shared/api/currency-revaluation-chart/currency-revaluation-api';
import {
  useChartData,
  useChartConfig,
  formatYAxisTick,
  BAR_SIZE,
  BAR_RADIUS,
  OPACITY_DEFAULT,
  OPACITY_DARK,
  OPACITY_LIGHT,
  TOOLTIP_Z_INDEX,
} from './utils';
import { renderLoadingState, renderErrorState, renderEmptyState } from './ChartStates';

export const CurrencyRevaluationChart = () => {
  const { theme, systemTheme } = useTheme();
  const { data: apiData, isLoading, error } = useGetCurrencyRevaluationQuery();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useChartData(apiData);
  const { xAxisMax, containerHeight, chartHeight, isDark, purchaseBarFill, growthBarFill } =
    useChartConfig(chartData, theme, systemTheme);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (isLoading) return renderLoadingState();
  if (error) return renderErrorState(error);
  if (chartData.length === 0) return renderEmptyState();

  const renderCells = (fill: string, customOpacity?: (index: number) => number) =>
    chartData.map((_, index) => (
      <Cell
        key={`${fill}-${index}`}
        fill={fill}
        opacity={customOpacity ? customOpacity(index) : 1}
        style={{ transition: 'opacity 0.2s ease' }}
      />
    ));

  const getGrowthOpacity = (index: number) =>
    hoveredIndex === index ? 1 : isDark ? OPACITY_DARK : OPACITY_LIGHT;

  return (
    <Card className="w-full max-w-[400px] mx-auto shadow-xl">
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
                content={<CustomTooltip isDark={isDark} />}
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
