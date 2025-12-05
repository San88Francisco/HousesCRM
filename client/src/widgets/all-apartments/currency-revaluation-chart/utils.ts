import { useMemo } from 'react';
import {
  transformCurrencyData,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';

export const ROW_HEIGHT = 45;
export const MIN_VISIBLE_ROWS = 4;
export const MAX_VISIBLE_ROWS = 7;
export const Y_AXIS_PADDING = 0.15;
export const MILLION = 1_000_000;
export const CHART_PADDING = 30;
export const MAX_TEXT_LENGTH_YAXIS = 10;

export const BAR_RADIUS = 4;
export const BAR_SIZE = 10;
export const OPACITY_DEFAULT = 0.85;
export const OPACITY_DARK = 0.6;
export const OPACITY_LIGHT = 0.7;
export const TOOLTIP_Z_INDEX = 9999;

interface RTKError {
  status: number;
  data: unknown;
}

const isErrorObject = (error: unknown): error is object => {
  return !!error && typeof error === 'object';
};

const extractMessageFromData = (data: unknown): string | undefined => {
  if (typeof data === 'string') {
    return data;
  }
  if (
    isErrorObject(data) &&
    'message' in data &&
    typeof (data as { message: unknown }).message === 'string'
  ) {
    return (data as { message: string }).message;
  }
  return undefined;
};

const getStandardErrorMessage = (error: object): string | undefined => {
  if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return undefined;
};

export const computeChartHeight = (dataLength: number): number => {
  return dataLength * ROW_HEIGHT + CHART_PADDING;
};

export const computeContainerHeight = (actualRows: number): number => {
  const displayRows = Math.min(Math.max(actualRows, MIN_VISIBLE_ROWS), MAX_VISIBLE_ROWS);
  return displayRows * ROW_HEIGHT + CHART_PADDING;
};

export const computeXAxisMax = (
  chartData: Array<{ purchaseAmount: number; revaluationAmount: number }>,
): number => {
  if (chartData.length === 0) {
    return MILLION;
  }
  const maxValue = chartData.reduce((max, item) => {
    const currentMax = Math.max(item.purchaseAmount, item.revaluationAmount);
    return Math.max(max, currentMax);
  }, 0);
  if (maxValue === 0) {
    return MILLION;
  }
  return Math.ceil((maxValue * (1 + Y_AXIS_PADDING)) / MILLION) * MILLION;
};

export const getBarColors = (isDark: boolean) => ({
  purchase: isDark ? 'rgba(198, 199, 248, 0.34)' : 'var(--dark)',
  growth: isDark ? 'var(--purple-medium)' : 'var(--dark-light)',
});

export const formatYAxisTick = (value: string) => {
  return truncateText(value, MAX_TEXT_LENGTH_YAXIS);
};

export const useChartData = (apiData: unknown) => {
  return useMemo(() => {
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
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
};

export const useChartConfig = (
  chartData: ChartDataItem[],
  theme: string | undefined,
  systemTheme: string | undefined,
) => {
  return useMemo(() => {
    const actualRows = chartData.length;
    const xAxisMax = computeXAxisMax(chartData);
    const containerHeight = computeContainerHeight(actualRows);
    const chartHeight = computeChartHeight(Math.max(actualRows, MIN_VISIBLE_ROWS));
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    const { purchase: purchaseBarFill, growth: growthBarFill } = getBarColors(isDark);

    return {
      xAxisMax,
      containerHeight,
      chartHeight,
      isDark,
      purchaseBarFill,
      growthBarFill,
    };
  }, [chartData, theme, systemTheme]);
};

export const getErrorMessage = (error: unknown): string => {
  const defaultMessage = 'Помилка завантаження даних';

  if (!isErrorObject(error)) {
    return defaultMessage;
  }

  if ('status' in error) {
    const messageFromData = extractMessageFromData((error as RTKError).data);
    if (messageFromData) {
      return messageFromData;
    }
  }

  const standardMessage = getStandardErrorMessage(error);
  if (standardMessage) {
    return standardMessage;
  }

  return defaultMessage;
};
