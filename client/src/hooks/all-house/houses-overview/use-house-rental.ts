import { useIsMobile } from '@/hooks/use-mobile';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { addFillToChartItems } from '@/shared/utils/all-house/add-fill-to-charts-items';
import {
  findMinMaxRentWithFivePercent,
  generateChartData,
  getPeriodRange,
} from '@/shared/utils/all-house/houses-overview/chart-houses-overview';
import {
  debounce,
  getDataRange,
  getOptimalTicks,
} from '@/shared/utils/all-house/houses-overview/chart-math';
import { TimeRangeEnum } from '@/types/core/time-range';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';

const DEFAULT_CHART_WIDTH = 800;
const DEFAULT_Y_MIN = 4000;
const DEFAULT_Y_MAX = 8000;
const Y_DOMAIN_STEP = 100;

export function useHouseRental(housesData: Partial<AllAnalyticsResponse>) {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(TimeRangeEnum.ALL_DATA);
  const [lockedHouse, setLockedHouse] = useState<string | null>(null);
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

  const hasData: boolean = Boolean(housesData?.housesOverview?.length);

  const housesDataWithFill = useMemo(
    () =>
      hasData && housesData.housesOverview ? addFillToChartItems(housesData, 'housesOverview') : [],
    [hasData, housesData],
  );

  const chartData = useMemo(
    () => (hasData ? generateChartData(housesDataWithFill, timeRange) : []),
    [hasData, housesDataWithFill, timeRange],
  );

  const periodRange = useMemo(
    () =>
      hasData && housesData.housesOverview
        ? getPeriodRange(timeRange, housesData.housesOverview)
        : { periodStart: '', periodEnd: '' },
    [hasData, timeRange, housesData],
  );

  const minMax = useMemo(
    () =>
      hasData && housesData.housesOverview
        ? findMinMaxRentWithFivePercent(
            housesData.housesOverview,
            periodRange.periodStart,
            periodRange.periodEnd,
          )
        : null,
    [hasData, housesData, periodRange.periodStart, periodRange.periodEnd],
  );

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
    lockedHouse,
    setLockedHouse,
    yDomain,
    yTicks,
    chartRef,
    chartWidth,
    cursorDate,
    optimalTicks,
    dataMin,
    dataMax,
    isMobile,
    housesDataWithFill,
    chartMouseHandlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}
