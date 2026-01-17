import { formatYAxis } from '@/shared/utils/all-house/payback-chart/payback';
import { cn } from '@/shared/utils/cn';
import { Currencies } from '@/types/core/currencies';
import { PaybackChartData } from '@/types/core/payback-chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomBar } from './CustomBar';
import { PaybackChartTooltip } from './PaybackChartTooltip';

const CHART_CURRENCY: Currencies = 'UAH';

type ChartCoordinatesProps = {
  yAxis?: {
    scale?: {
      ticks?: (count: number) => number[];
      (value: number): number;
    };
  };
};

interface ChartContentProps {
  paddedChartData: PaybackChartData[];
  chartMarginWithLegend: { top: number; right: number; left: number; bottom: number };
  scaleType: 'linear' | 'log';
  yAxisDomain: [number | string, number | string];
  horizontalCoordinatesGenerator: (props: ChartCoordinatesProps) => number[];
  activeApartment: string | null;
  totalChartHeight: number;
}

export const ChartContent = ({
  paddedChartData,
  chartMarginWithLegend,
  scaleType,
  yAxisDomain,
  horizontalCoordinatesGenerator,
  activeApartment,
  totalChartHeight,
}: ChartContentProps) => (
  <ResponsiveContainer width="100%" height={totalChartHeight}>
    <BarChart data={paddedChartData} margin={chartMarginWithLegend} barSize={20}>
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
      <Tooltip
        content={<PaybackChartTooltip />}
        cursor={false}
        allowEscapeViewBox={{ x: false, y: false }}
      />
      <Bar
        dataKey="purchasePriceUSD"
        shape={(props: unknown) => (
          <CustomBar {...(props as object)} activeApartment={activeApartment} />
        )}
      />
    </BarChart>
  </ResponsiveContainer>
);

interface ScrollContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isScrollNeeded: boolean;
  isDragging: boolean;
  handlePointerDown?: (e: React.PointerEvent) => void;
  handlePointerMove?: (e: React.PointerEvent) => void;
  minChartWidth: number;
  children: React.ReactNode;
}

export const ScrollContainer = ({
  scrollRef,
  isScrollNeeded,
  isDragging,
  handlePointerDown,
  handlePointerMove,
  minChartWidth,
  children,
}: ScrollContainerProps) => (
  <div
    ref={scrollRef}
    className={cn(
      isScrollNeeded ? 'overflow-x-auto' : 'overflow-x-hidden',
      'overflow-y-hidden',
      isScrollNeeded && (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
      'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200',
      'dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800',
    )}
    onPointerDown={isScrollNeeded ? handlePointerDown : undefined}
    onPointerMove={isScrollNeeded ? handlePointerMove : undefined}
  >
    <div style={{ minWidth: isScrollNeeded ? `${minChartWidth}px` : '100%' }}>{children}</div>
  </div>
);
