/* eslint-disable */
'use client';

import { useEffect, useState, useRef } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PaybackChartData } from '@/types/core/payback-chart/analytics';
import { transformPaybackData } from '@/shared/utils/all-apartments/payback-chart/payback';
import { mockPaybackStats } from '@/shared/constants/payback-chart/analytics.mock';
import { useTheme } from 'next-themes';
import { CustomBar } from './CustomBar';
import { CustomTooltip } from './CustomTooltip';

const LOADING_DELAY = 500;
const MIN_CHART_WIDTH = 800;
const CHART_WIDTH_MULTIPLIER = 80;
const Y_AXIS_ROUNDING = 100000;
const CHART_HEIGHT = 400;
const Y_AXIS_PADDING_PERCENT = 0.2;

export const PaybackChart = () => {
  const [data, setData] = useState<PaybackChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => {
        setTimeout(resolve, LOADING_DELAY);
      });
      const transformedData = transformPaybackData(mockPaybackStats);
      setData(transformedData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) {
      return;
    }
    e.preventDefault();
    const SCROLL_SPEED = 2;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * SCROLL_SPEED;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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

  const maxPrice = Math.max(...data.map(d => d.purchasePriceUSD));
  const maxPriceWithPadding = maxPrice * (1 + Y_AXIS_PADDING_PERCENT);
  const yAxisMax = Math.ceil(maxPriceWithPadding / Y_AXIS_ROUNDING) * Y_AXIS_ROUNDING;

  const minChartWidth = Math.max(MIN_CHART_WIDTH, data.length * CHART_WIDTH_MULTIPLIER);

  return (
    <div className={`w-full p-4 md:p-6 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <h2
        className={`text-lg md:text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        Статистика окупності квартир
      </h2>

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
                stroke={isDark ? '#4b5563' : '#e5e7eb'}
                vertical={false}
                strokeDasharray="0"
                strokeWidth={1}
              />

              <XAxis
                dataKey="apartmentName"
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, yAxisMax]}
                tickFormatter={(value: number) => {
                  const MILLION = 1_000_000;
                  const THOUSAND = 1_000;
                  const ONE_DECIMAL = 1;
                  const ZERO_DECIMAL = 0;

                  if (value >= MILLION) {
                    return `${(value / MILLION).toFixed(ONE_DECIMAL)}M`;
                  }
                  if (value >= THOUSAND) {
                    return `${(value / THOUSAND).toFixed(ZERO_DECIMAL)}k`;
                  }
                  return value.toString();
                }}
                tick={{ fontSize: 14, fill: '#9ca3af', fontWeight: 500 }}
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
