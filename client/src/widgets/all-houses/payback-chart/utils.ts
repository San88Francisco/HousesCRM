import React, { useMemo, useState, useRef, useCallback } from 'react';
import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart/analytics';
import { transformPaybackData } from '@/shared/utils/all-house/payback-chart/payback';

const MIN_CHART_WIDTH = 800;
const CHART_WIDTH_MULTIPLIER = 80;
const Y_AXIS_ROUNDING = 100000;
const Y_AXIS_PADDING_PERCENT = 0.2;
const SCROLL_SPEED = 2;

export const usePaybackChartData = (apiData: HousePaybackStats[] | undefined) => {
  return useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    return transformPaybackData(apiData);
  }, [apiData]);
};

export const useChartDimensions = (data: PaybackChartData[]) => {
  return useMemo(() => {
    const maxPrice = Math.max(...data.map(d => d.purchasePriceUSD));
    const maxPriceWithPadding = maxPrice * (1 + Y_AXIS_PADDING_PERCENT);
    const yAxisMax = Math.ceil(maxPriceWithPadding / Y_AXIS_ROUNDING) * Y_AXIS_ROUNDING;
    const minChartWidth = Math.max(MIN_CHART_WIDTH, data.length * CHART_WIDTH_MULTIPLIER);

    return { yAxisMax, minChartWidth };
  }, [data]);
};

export const useChartScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * SCROLL_SPEED;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    scrollRef,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === 'string') return data;
      if (typeof data === 'object' && data !== null && 'message' in data) {
        return (data as { message: string }).message;
      }
    }
    if ('message' in error) {
      return (error as { message: string }).message;
    }
  }
  return 'Помилка завантаження даних';
};
