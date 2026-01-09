import { Currencies } from '@/types/core/currencies';
import { HousePaybackStats, PaybackChartData } from '@/types/core/payback-chart';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { transformPaybackData } from './payback';

const MIN_CHART_WIDTH = 800;
const CHART_WIDTH_PER_ITEM = 100;
const Y_AXIS_PADDING_PERCENT = 0.2;
const SCROLL_SPEED = 2;
const LOG_SCALE_THRESHOLD = 100;

const ROUNDING_STEPS = [
  { max: 10_000, step: 1_000 },
  { max: 50_000, step: 5_000 },
  { max: 100_000, step: 10_000 },
  { max: 500_000, step: 50_000 },
  { max: 1_000_000, step: 100_000 },
  { max: Infinity, step: 500_000 },
] as const;

const getOptimalRounding = (maxValue: number): number => {
  const config = ROUNDING_STEPS.find(({ max }) => maxValue <= max);
  return config?.step ?? 500_000;
};

export const usePaybackChartData = (
  apiData?: HousePaybackStats[],
  currency: Currencies = 'USD',
) => {
  return useMemo(() => {
    if (!apiData?.length) return [];
    return transformPaybackData(apiData, currency);
  }, [apiData, currency]);
};

export const useChartDimensions = (data: PaybackChartData[]) => {
  return useMemo(() => {
    if (!data?.length) {
      return {
        yAxisMax: 0,
        yAxisMin: 0,
        minChartWidth: MIN_CHART_WIDTH,
        scaleType: 'linear' as const,
      };
    }

    const prices = data.map(d => d.purchasePriceUSD).filter(p => p > 0);

    if (!prices.length) {
      return {
        yAxisMax: 0,
        yAxisMin: 0,
        minChartWidth: MIN_CHART_WIDTH,
        scaleType: 'linear' as const,
      };
    }

    const maxPrice = prices.reduce((max, current) => Math.max(max, current), -Infinity);
    const minPrice = prices.reduce((min, current) => Math.min(min, current), Infinity);

    const scaleType =
      maxPrice / minPrice >= LOG_SCALE_THRESHOLD ? ('log' as const) : ('linear' as const);

    const maxPriceWithPadding = maxPrice * (1 + Y_AXIS_PADDING_PERCENT);
    const roundingStep = getOptimalRounding(maxPriceWithPadding);
    const yAxisMax = Math.ceil(maxPriceWithPadding / roundingStep) * roundingStep;

    const yAxisMin = scaleType === 'log' ? Math.max(1, Math.floor(minPrice * 0.8)) : 0;

    const minChartWidth = Math.max(MIN_CHART_WIDTH, data.length * CHART_WIDTH_PER_ITEM);

    return { yAxisMax, yAxisMin, minChartWidth, scaleType };
  }, [data]);
};

export const useChartScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const element = scrollRef.current;
    if (!element) return;

    element.setPointerCapture(e.pointerId);

    setIsDragging(true);
    setStartX(e.pageX - element.offsetLeft);
    setScrollLeft(element.scrollLeft);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !scrollRef.current) return;

      e.preventDefault();

      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * SCROLL_SPEED;

      scrollRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft],
  );

  useEffect(() => {
    window.addEventListener('pointerup', handleDragEnd);

    return () => {
      window.removeEventListener('pointerup', handleDragEnd);
    };
  }, [handleDragEnd]);

  return {
    scrollRef,
    isDragging,
    handlePointerDown,
    handlePointerMove,
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) {
    return 'Помилка завантаження даних';
  }

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

  return 'Помилка завантаження даних';
};
