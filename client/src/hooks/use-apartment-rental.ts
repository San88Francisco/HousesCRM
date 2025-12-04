import {
  findMinMaxRentWithFivePercent,
  generateChartData,
  getPeriodRange,
  generateOptimalTicks,
} from '@/shared/utils/apartments/period';
import { Apartment, TimeRangeEnum } from '@/types/core/apartment';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPaletteColors } from '@/shared/utils/apartments/colors';

export function useApartmentRental(apartmentsData: Apartment[]) {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(TimeRangeEnum.ONE_YEAR);
  const [lockedApartment, setLockedApartment] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const chartData = useMemo(
    () => generateChartData(apartmentsData, timeRange),
    [apartmentsData, timeRange],
  );

  const { periodStart, periodEnd } = useMemo(
    () => getPeriodRange(timeRange, apartmentsData),
    [timeRange, apartmentsData],
  );

  const minMax = useMemo(
    () => findMinMaxRentWithFivePercent(apartmentsData, periodStart, periodEnd),
    [apartmentsData, periodStart, periodEnd],
  );

  const yDomain = useMemo(() => {
    if (!minMax) return [4000, 8000];
    return [Math.floor(minMax.min / 100) * 100, Math.ceil(minMax.max / 100) * 100];
  }, [minMax]);

  const yTicks = useMemo(() => {
    if (!minMax) return [4000, 6000, 8000];
    return [yDomain[0], Math.round((yDomain[0] + yDomain[1]) / 2), yDomain[1]];
  }, [minMax, yDomain]);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [cursorDate, setCursorDate] = useState<string>('');

  const paletteColors = useMemo(() => getPaletteColors(), []);

  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseMove = useCallback((e: { activeLabel?: string }) => {
    if (e?.activeLabel) {
      setCursorDate(e.activeLabel);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorDate('');
  }, []);

  const optimalTicks = useMemo(() => {
    if (chartWidth === 0 || chartData.length === 0) return [];

    const minDate = Math.min(...chartData.map(d => d.date));
    const maxDate = Math.max(...chartData.map(d => d.date));

    return generateOptimalTicks(minDate, maxDate, chartWidth, isMobile);
  }, [chartWidth, chartData, isMobile]);

  const tooltipWrapperStyle = useMemo(() => {
    if (!isMobile) return {};

    return {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      top: 'unset' as const,
      right: 'unset' as const,
      pointerEvents: 'none' as const,
      zIndex: 1000,
    };
  }, [isMobile]);

  const chartMouseHandlers = useMemo(
    () => ({
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    }),
    [handleMouseMove, handleMouseLeave],
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
    paletteColors,
    optimalTicks,
    tooltipWrapperStyle,
    chartMouseHandlers,
    isMobile,
  };
}
