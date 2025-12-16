import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

import {
  findMinMaxRentWithFivePercent,
  generateChartData,
  getPeriodRange,
} from '@/shared/utils/all-apartments/houses-overview/chart-houses-overview';
import {
  DEFAULT_CHART_WIDTH,
  DEFAULT_Y_MAX,
  DEFAULT_Y_MIN,
  Y_DOMAIN_STEP,
} from '@/constants/line-chart/line-chart';
import {
  debounce,
  getDataRange,
  getOptimalTicks,
} from '@/shared/utils/all-apartments/houses-overview/chart-math';
import { TimeRangeEnum } from '@/types/core/houses-overview/types';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import { addFillToChartItems } from '@/shared/utils/all-apartments/add-fill-to-charts-items';

export function useApartmentRental(apartmentsData: AllAnalyticsResponse) {
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

  const hasData = apartmentsData?.housesOverview && apartmentsData.housesOverview.length > 0;

  const apartmentsDataWithFill = useMemo(
    () => (hasData ? addFillToChartItems(apartmentsData, 'housesOverview') : []),
    [hasData, apartmentsData],
  );

  const chartData = useMemo(
    () => (hasData ? generateChartData(apartmentsDataWithFill, timeRange) : []),
    [hasData, apartmentsData, timeRange],
  );

  const periodRange = useMemo(
    () =>
      hasData
        ? getPeriodRange(timeRange, apartmentsData.housesOverview)
        : { periodStart: '', periodEnd: '' },
    [hasData, timeRange, apartmentsData],
  );

  const minMax = useMemo(
    () =>
      hasData
        ? findMinMaxRentWithFivePercent(
            apartmentsData.housesOverview,
            periodRange.periodStart,
            periodRange.periodEnd,
          )
        : null,
    [hasData, apartmentsData, periodRange.periodStart, periodRange.periodEnd],
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
    isMobile,
    apartmentsDataWithFill,
    chartMouseHandlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}
