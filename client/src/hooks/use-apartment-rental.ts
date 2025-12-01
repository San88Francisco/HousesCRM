import {
  findMinMaxRentWithFivePercent,
  generateChartData,
  getPeriodRange,
} from '@/shared/utils/apartments/period';
import { Apartment, TimeRangeEnum } from '@/types/core/apartment';
import { useState, useMemo } from 'react';

export function useApartmentRental(apartmentsData: Apartment[]) {
  const [timeRange, setTimeRange] = useState<TimeRangeEnum>(TimeRangeEnum.ONE_YEAR);

  const [lockedApartment, setLockedApartment] = useState<string | null>(null);

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

  return {
    timeRange,
    setTimeRange,
    chartData,
    lockedApartment,
    setLockedApartment,
    yDomain,
    yTicks,
  };
}
