import {
  CHART_WIDTH_THRESHOLD,
  DESKTOP_TICKS,
  MOBILE_TABLET_TICKS,
  ONE_YEAR_MS,
  SMALL_MOBILE_TICKS,
} from '@/shared/constants/line-chart';
import { TimeRangeEnum } from '@/types/core/time-range';
import { DataPointChart } from '@/types/model/houses-overview';

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

export const getDataRange = (hasData: boolean, chartData: DataPointChart[]) => {
  if (!hasData || chartData.length === 0) {
    return { dataMin: Date.now() - ONE_YEAR_MS, dataMax: Date.now() };
  }
  const dates = chartData.map(d => d.date);
  const dataMin = dates.reduce((a, b) => Math.min(a, b), dates[0]);
  const dataMax = dates.reduce((a, b) => Math.max(a, b), dates[0]);

  return { dataMin, dataMax };
};

export const getOptimalTicks = (
  chartWidth: number,
  chartData: DataPointChart[],
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

  if (count <= 1 || totalMonths <= 0) {
    return Array.from(new Set([dataMin, dataMax]));
  }

  const stepMonths = Math.max(1, Math.ceil(totalMonths / (count - 1)));

  const ticks = Array.from({ length: count }).map((_, i) => {
    const tickDate = new Date(endDate);
    tickDate.setMonth(endDate.getMonth() - i * stepMonths);
    return tickDate.getTime();
  });

  ticks.reverse();

  if (ticks[0] < dataMin) {
    ticks[0] = dataMin;
  }

  if (ticks.length > 1) {
    const diff = ticks[1] - ticks[0];
    const HALF_MONTH_MS = 15 * 24 * 60 * 60 * 1000;
    const threshold = stepMonths * HALF_MONTH_MS;
    if (diff < threshold) {
      ticks.splice(1, 1);
    }
  }

  return Array.from(new Set(ticks)).sort((a, b) => a - b);
};
