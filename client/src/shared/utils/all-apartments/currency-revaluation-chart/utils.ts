import { ChartDataItem, CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

const MILLION = 1_000_000;
const THOUSAND = 1_000;
const DECIMAL_PLACES_MILLION = 1;
const DECIMAL_PLACES_THOUSAND = 0;
const DECIMAL_PLACES_RATE = 2;
const DEFAULT_MAX_LENGTH = 15;

export const BAR_RADIUS = 4;
export const BAR_SIZE = 10;
export const OPACITY_DEFAULT = 0.85;
export const OPACITY_DARK = 0.6;
export const OPACITY_LIGHT = 0.7;
export const TOOLTIP_Z_INDEX = 9999;

export const MAX_TEXT_LENGTH_YAXIS = 10;
export const Y_AXIS_PADDING = 0.15;
export const ROW_HEIGHT = 30;
export const CHART_PADDING = 30;
export const MIN_VISIBLE_ROWS = 4;
export const MAX_VISIBLE_ROWS = 7;

export const getBarColors = (isDark: boolean) => ({
  purchase: isDark ? 'var(--dark-purple)' : 'var(--dark)',
  growth: isDark ? 'var(--purple-medium)' : 'var(--dark-light)',
});

export const transformCurrencyData = (data: CurrencyRevaluation[]): ChartDataItem[] => {
  return data.map(item => ({
    apartmentName: item.apartmentName,
    purchaseAmount: item.purchaseAmountUah,
    revaluationAmount: item.revaluationAmountUah,
    purchaseRate: item.purchaseRate,
    currentRate: item.currentRate,
    id: item.id,
  }));
};

export const formatCurrency = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(DECIMAL_PLACES_MILLION)}M ₴`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(DECIMAL_PLACES_THOUSAND)}k ₴`;
  }
  return `${value} ₴`;
};

export const formatRate = (rate: number): string => {
  return `${rate.toFixed(DECIMAL_PLACES_RATE)} ₴/$`;
};

export const truncateText = (text: string, maxLength: number = DEFAULT_MAX_LENGTH): string => {
  const shouldTruncate = text.length > maxLength;

  if (shouldTruncate) {
    return `${text.substring(0, maxLength)}...`;
  }

  return text;
};

export const formatYAxisTick = (value: string) => {
  return truncateText(value, MAX_TEXT_LENGTH_YAXIS);
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

type RTKError = {
  status: number;
  data: unknown;
};

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
