import {
  CHART_WIDTH_THRESHOLD,
  DESKTOP_TICKS,
  MOBILE_TABLET_TICKS,
  ONE_YEAR_MS,
  SMALL_MOBILE_TICKS,
} from '@/constants/line-chart/line-chart';
import { ChartDataPoint, TimeRangeEnum } from '@/types/core/revenue-distribution-chart';

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

export const getDataRange = (hasData: boolean, chartData: ChartDataPoint[]) => {
  if (!hasData || chartData.length === 0) {
    return { min: Date.now() - ONE_YEAR_MS, max: Date.now() };
  }
  return {
    min: Math.min(...chartData.map(d => d.date)),
    max: Math.max(...chartData.map(d => d.date)),
  };
};

export const getOptimalTicks = (
  chartWidth: number,
  chartData: ChartDataPoint[],
  dataMin: number,
  dataMax: number,
  timeRange: TimeRangeEnum,
  isMobile: boolean,
  isTablet: boolean,
  isSmallMobile: boolean,
): number[] => {
  if (chartWidth <= CHART_WIDTH_THRESHOLD || chartData.length <= 1) {
    return [dataMin, dataMax];
  }

  let count: number;
  if (timeRange === TimeRangeEnum.SIX_MONTHS) {
    count = MOBILE_TABLET_TICKS;
  } else if (isSmallMobile) {
    count = SMALL_MOBILE_TICKS;
  } else if (isMobile || isTablet) {
    count = MOBILE_TABLET_TICKS;
  } else {
    count = DESKTOP_TICKS;
  }

  const startDate = new Date(dataMin);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(dataMax);
  endDate.setDate(1);
  endDate.setHours(0, 0, 0, 0);

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const stepMonths = Math.ceil(totalMonths / (count - 1));

  const ticks = Array.from({ length: count }).map((_, i) => {
    const tickDate = new Date(endDate);
    tickDate.setMonth(endDate.getMonth() - i * stepMonths);
    return tickDate.getTime();
  });

  ticks.reverse();

  if (ticks[0] < dataMin) {
    ticks[0] = dataMin;
  }

  return ticks;
};
