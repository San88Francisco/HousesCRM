/* eslint-disable */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import {
  transformCurrencyData,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';
import { cn } from '@/shared/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CustomTooltip } from './CustomTooltip';
import { useGetCurrencyRevaluationQuery } from '@/shared/api/currency-revaluation-chart/currency-revaluation-api';
import {
  computeChartHeight,
  computeContainerHeight,
  computeXAxisMax,
  getBarColors,
  MAX_VISIBLE_ROWS,
  MIN_VISIBLE_ROWS,
} from './utils';

const MAX_TEXT_LENGTH_YAXIS = 10;

const formatYAxisTick = (value: string) => {
  return truncateText(value, MAX_TEXT_LENGTH_YAXIS);
};

export const CurrencyRevaluationChart = () => {
  const { theme, systemTheme } = useTheme();
  const { data: apiData, isLoading, error } = useGetCurrencyRevaluationQuery();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      return [];
    }

    const transformed = transformCurrencyData(apiData);

    return transformed
      .map(item => {
        const rawGrowth = item.revaluationAmount - item.purchaseAmount;
        return {
          ...item,
          growthAmount: Math.max(rawGrowth, 0),
        };
      })
      .reverse();
  }, [apiData]);

  const xAxisMax = useMemo(() => computeXAxisMax(chartData), [chartData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  const { purchase: purchaseBarFill, growth: growthBarFill } = getBarColors(isDark);

  if (isLoading) {
    return (
      <Card className="max-w-[400px] mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-current')} />
            <p className="text-muted-text">Завантаження...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    let errorMessage = 'Помилка завантаження даних';

    if ('status' in error) {
      errorMessage =
        typeof error.data === 'string'
          ? error.data
          : typeof error.data === 'object' && error.data !== null && 'message' in error.data
            ? (error.data as { message: string }).message || errorMessage
            : errorMessage;
    } else if ('message' in error) {
      errorMessage = error.message || errorMessage;
    }

    return (
      <Card className="max-w-[400px] mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="mb-2 text-red-500">Помилка завантаження даних</p>
            <p className="text-sm text-muted-text">{errorMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="max-w-[400px] mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-muted-text">Немає даних для відображення</p>
        </CardContent>
      </Card>
    );
  }

  const actualRows = chartData.length;
  const containerHeight = computeContainerHeight(actualRows);
  const chartHeight = computeChartHeight(Math.max(actualRows, MIN_VISIBLE_ROWS));

  return (
    <Card className="w-full max-w-[400px] mx-auto shadow-xl">
      <CardHeader>
        <CardTitle>Переоцінка валюти</CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className="w-full no-scrollbar"
          style={{
            height: containerHeight,
            overflowY: actualRows > MAX_VISIBLE_ROWS ? 'auto' : 'hidden',
          }}
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
              onMouseLeave={() => {
                setHoveredIndex(null);
              }}
            >
              <XAxis type="number" domain={[0, xAxisMax]} hide={true} />

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
              />

              <Bar
                dataKey="purchaseAmount"
                stackId="a"
                radius={[4, 0, 0, 4]}
                barSize={10}
                fill={purchaseBarFill}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={350}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => {
                  const isHovered = hoveredIndex === index;
                  return (
                    <Cell
                      key={`purchase-${index}`}
                      fill={purchaseBarFill}
                      opacity={isHovered ? 1 : 0.85}
                      style={{ transition: 'opacity 0.2s ease' }}
                    />
                  );
                })}
              </Bar>

              <Bar
                dataKey="growthAmount"
                stackId="a"
                radius={[0, 4, 4, 0]}
                barSize={10}
                fill={growthBarFill}
                isAnimationActive={true}
                animationBegin={300}
                animationDuration={550}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => {
                  const isHovered = hoveredIndex === index;
                  return (
                    <Cell
                      key={`growth-${index}`}
                      fill={growthBarFill}
                      opacity={isHovered ? 1 : isDark ? 0.6 : 0.7}
                      style={{ transition: 'opacity 0.2s ease' }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
