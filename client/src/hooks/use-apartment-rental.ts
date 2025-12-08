import { useState, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Apartment, ChartDataPoint, TimeRangeEnum } from '@/types/core/line-chart';
import {
  findMinMaxRentWithFivePercent,
  generateChartData,
  getPeriodRange,
} from '@/shared/utils/line-chart/line-chart';

import {
  CHART_WIDTH_THRESHOLD,
  DEFAULT_CHART_WIDTH,
  DEFAULT_Y_MAX,
  DEFAULT_Y_MIN,
  DESKTOP_TICKS,
  MOBILE_TABLET_TICKS,
  ONE_YEAR_MS,
  SMALL_MOBILE_TICKS,
  Y_DOMAIN_STEP,
} from '@/constants/line-chart/line-chart';

const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

const getDataRange = (hasData: boolean, chartData: ChartDataPoint[]) => {
  if (!hasData || chartData.length === 0) {
    return { min: Date.now() - ONE_YEAR_MS, max: Date.now() };
  }
  return {
    min: Math.min(...chartData.map(d => d.date)),
    max: Math.max(...chartData.map(d => d.date)),
  };
};

const getOptimalTicks = (
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

export function useApartmentRental(apartmentsData: Apartment[]) {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(TimeRangeEnum.ONE_YEAR);
  const [lockedApartment, setLockedApartment] = useState<string | null>(null);
  const [cursorDate, setCursorDate] = useState<string>('');
  const [chartWidth, setChartWidth] = useState(DEFAULT_CHART_WIDTH);

  const { isMobile, isTablet, isSmallMobile } = useIsMobile();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
      }
    };

    const debouncedUpdateWidth = debounce(updateWidth, 150);

    updateWidth();

    window.addEventListener('resize', debouncedUpdateWidth);
    return () => window.removeEventListener('resize', debouncedUpdateWidth);
  }, []);

  const handleMouseMove = useCallback((e: { activeLabel?: string }) => {
    if (e?.activeLabel) setCursorDate(e.activeLabel);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorDate('');
  }, []);

  const hasData = apartmentsData && apartmentsData.length > 0;
  const chartData = hasData ? generateChartData(apartmentsData, timeRange) : [];

  const periodRange = hasData
    ? getPeriodRange(timeRange, apartmentsData)
    : { periodStart: '', periodEnd: '' };
  const minMax = hasData
    ? findMinMaxRentWithFivePercent(apartmentsData, periodRange.periodStart, periodRange.periodEnd)
    : null;

  const yDomain = !minMax
    ? [DEFAULT_Y_MIN, DEFAULT_Y_MAX]
    : [
        Math.floor(minMax.min / Y_DOMAIN_STEP) * Y_DOMAIN_STEP,
        Math.ceil(minMax.max / Y_DOMAIN_STEP) * Y_DOMAIN_STEP,
      ];

  const yTicks = !minMax
    ? [DEFAULT_Y_MIN, (DEFAULT_Y_MIN + DEFAULT_Y_MAX) / 2, DEFAULT_Y_MAX]
    : [yDomain[0], Math.round((yDomain[0] + yDomain[1]) / 2), yDomain[1]];

  const { min: dataMin, max: dataMax } = getDataRange(hasData, chartData);

  const optimalTicks = getOptimalTicks(
    chartWidth,
    chartData,
    dataMin,
    dataMax,
    timeRange,
    isMobile,
    isTablet,
    isSmallMobile,
  );

  return {
    timeRange,
    setTimeRange,
    chartData,
    lockedApartment,
    setLockedApartment,
    yDomain,
    yTicks,
    chartRef,
    chartWidth,
    cursorDate,
    optimalTicks,
    dataMin,
    dataMax,
    chartMouseHandlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}
