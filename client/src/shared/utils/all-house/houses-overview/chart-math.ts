import { TimeRangeEnum } from '@/types/core/time-range';
import { ChartDataPoint } from '@/types/model/houses-overview';

const CHART_WIDTH_THRESHOLD = 50;
const SMALL_MOBILE_TICKS = 4;
const MOBILE_TABLET_TICKS = 7;
const DESKTOP_TICKS = 13;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

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
  const dates = chartData.map(d => d.date);
  const min = dates.reduce((a, b) => Math.min(a, b), dates[0]);
  const max = dates.reduce((a, b) => Math.max(a, b), dates[0]);

  return { min, max };
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

  if (count <= 1) {
    return [dataMin];
  }

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
