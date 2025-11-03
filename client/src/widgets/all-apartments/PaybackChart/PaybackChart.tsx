'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { CustomXAxisTick } from './components/CustomXAxisTick';
import { CustomBar } from './components/CustomBar/CustomBar';
import { CustomTooltip } from './components/CustomTooltip';

import { usePaybackChart } from './hooks/usePaybackChart';
import { useChartScroll } from './hooks/useChartScroll';

import { formatYAxisTick } from './utils/chart-formatters';

const CHART_HEIGHT = 400;

const ChartLoadingState = ({ isDark }: { isDark: boolean }) => (
  <div className="flex items-center justify-center h-96">
    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Завантаження...</p>
  </div>
);

const getContainerClasses = (isDark: boolean): string => {
  return `w-full p-4 md:p-6 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`;
};

const getTitleClasses = (isDark: boolean): string => {
  return `text-lg md:text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`;
};

export const PaybackChart = () => {
  const { data, loading, mounted, isDark, yAxisMax, minChartWidth } = usePaybackChart();

  const { scrollContainerRef, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useChartScroll();

  if (!mounted) {
    return null;
  }

  if (loading) {
    return <ChartLoadingState isDark={isDark} />;
  }

  const containerClasses = getContainerClasses(isDark);
  const titleClasses = getTitleClasses(isDark);
  const gridStroke = isDark ? '#4b5563' : '#e5e7eb';
  const yAxisFill = isDark ? '#9ca3af' : '#9ca3af';

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Статистика окупності квартир</h2>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ minWidth: `${minChartWidth}px` }}>
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={20}
            >
              <CartesianGrid
                stroke={gridStroke}
                vertical={false}
                strokeDasharray="0"
                strokeWidth={1}
              />

              <XAxis
                dataKey="apartmentName"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={<CustomXAxisTick isDark={isDark} />}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, yAxisMax]}
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 14, fill: yAxisFill, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={false} />

              <Bar dataKey="purchasePriceUSD" shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
