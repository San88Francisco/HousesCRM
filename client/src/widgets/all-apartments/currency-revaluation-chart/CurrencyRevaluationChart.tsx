/* eslint-disable */
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import {
  transformCurrencyData,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';
import { CustomTooltip } from './CustomTooltip';
import { useCurrencyRevaluation } from '@/hooks/currency-revaluation-chart/use-currency-revaluation';

const ROW_HEIGHT = 45;
const MIN_VISIBLE_ROWS = 4;
const MAX_VISIBLE_ROWS = 7;
const Y_AXIS_PADDING = 0.15;
const MAX_TEXT_LENGTH_YAXIS = 10;
const MILLION = 1_000_000;
const computeChartHeight = (dataLength: number) => dataLength * ROW_HEIGHT + 30;

const formatYAxisTick = (value: string) => {
  return truncateText(value, MAX_TEXT_LENGTH_YAXIS);
};

export const CurrencyRevaluationChart = () => {
  const { theme, systemTheme } = useTheme();
  const { data: apiData, loading, error } = useCurrencyRevaluation();
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      return [];
    }

    const transformed = transformCurrencyData(apiData);

    return transformed
      .map(item => ({
        ...item,
        growthAmount: item.revaluationAmount - item.purchaseAmount,
      }))
      .reverse();
  }, [apiData]);

  const xAxisMax = useMemo(() => {
    if (chartData.length === 0) {
      return MILLION;
    }
    const maxValue = Math.max(...chartData.map(d => d.revaluationAmount));
    return Math.ceil((maxValue * (1 + Y_AXIS_PADDING)) / MILLION) * MILLION;
  }, [chartData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const purchaseBarFill = isDark ? 'rgba(198, 199, 248, 0.34)' : 'var(--dark)';
  const growthBarFill = isDark ? 'var(--purple-medium)' : 'var(--dark-light)';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderBottomColor: 'var(--text)' }}
          />
          <p style={{ color: 'var(--muted-text)' }}>Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="mb-2" style={{ color: 'var(--red)' }}>
            Помилка завантаження даних
          </p>
          <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: 'var(--muted-text)' }}>Немає даних для відображення</p>
      </div>
    );
  }

  const actualRows = chartData.length;
  const displayRows = Math.min(Math.max(actualRows, MIN_VISIBLE_ROWS), MAX_VISIBLE_ROWS);
  const containerHeight = displayRows * ROW_HEIGHT + 30;
  const chartHeight = computeChartHeight(Math.max(actualRows, MIN_VISIBLE_ROWS));

  return (
    <div
      className="w-full p-6 rounded-2xl shadow-xl"
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: isDark ? 'var(--foreground)' : 'var(--white)',
      }}
    >
      <h2 className="text-lg font-semibold mb-8" style={{ color: 'var(--text)' }}>
        Переоцінка валюти
      </h2>

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

            <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: 'transparent' }} />

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
    </div>
  );
};
