/* eslint-disable */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import { mockCurrencyRevaluation } from '@/shared/constants/currency-revaluation-chart/mock-data';
import {
  transformCurrencyData,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';
import { CustomTooltip } from './CustomTooltip';

const ROW_HEIGHT = 45;
const MAX_VISIBLE_ROWS = 7;
const LOADING_DELAY = 500;
const Y_AXIS_PADDING = 0.15;
const MAX_TEXT_LENGTH_YAXIS = 10;
const computeChartHeight = (dataLength: number) => dataLength * ROW_HEIGHT + 30;

const formatYAxisTick = (value: string) => {
  return truncateText(value, MAX_TEXT_LENGTH_YAXIS);
};

export const CurrencyRevaluationChart = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise<void>(resolve => {
        setTimeout(resolve, LOADING_DELAY);
      });
      setLoading(false);
    };
    void loadData();
  }, []);

  const chartData = useMemo(() => {
    const transformed = transformCurrencyData(mockCurrencyRevaluation);

    return transformed
      .map(item => ({
        ...item,
        growthAmount: item.revaluationAmount - item.purchaseAmount,
      }))
      .reverse();
  }, []);

  const xAxisMax = useMemo(() => {
    if (chartData.length === 0) {
      return 1000000;
    }
    const maxValue = Math.max(...chartData.map(d => d.revaluationAmount));
    return Math.ceil((maxValue * (1 + Y_AXIS_PADDING)) / 1000000) * 1000000;
  }, [chartData]);

  const purchaseBarFill = isDark ? '#c6c7f856' : '#1f2937';
  const growthBarFill = isDark ? '#C6C7F8' : '#d1d5db';

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Завантаження...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full p-6 rounded-2xl shadow-xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      <h2 className={`text-lg font-semibold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Переоцінка валюти
      </h2>

      <div
        className="w-full no-scrollbar"
        style={{
          maxHeight: MAX_VISIBLE_ROWS * ROW_HEIGHT + 30,
          overflowY: 'scroll',
        }}
      >
        <ResponsiveContainer
          width="100%"
          height={computeChartHeight(chartData.length)}
          minWidth={280}
        >
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
            <XAxis type="number" domain={[0, xAxisMax]} hide={true} strokeOpacity={0} />

            <YAxis
              type="category"
              dataKey="apartmentName"
              tickFormatter={formatYAxisTick}
              tick={{
                fontSize: 13,
                fill: isDark ? '#d1d5db' : '#1f2937',
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
