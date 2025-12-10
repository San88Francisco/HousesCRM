import {
  Apartment,
  ChartDataPoint,
  Contract,
  TimeRangeEnum,
} from '@/types/core/houses-overview/types';

const timeRangeMap: Record<TimeRangeEnum, (date: Date) => Date> = {
  [TimeRangeEnum.SIX_MONTHS]: date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 6);
    return d;
  },
  [TimeRangeEnum.ONE_YEAR]: date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  },
  [TimeRangeEnum.TWO_YEARS]: date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() - 2);
    return d;
  },
  [TimeRangeEnum.FIVE_YEARS]: date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() - 5);
    return d;
  },
  [TimeRangeEnum.TEN_YEARS]: date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() - 10);
    return d;
  },
  [TimeRangeEnum.FIFTEEN_YEARS]: date => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() - 15);
    return d;
  },
  [TimeRangeEnum.ALL_DATA]: date => date,
};

const getEarliestContractDate = (apartments: Apartment[], fallback: Date): Date =>
  apartments
    .flatMap(apt => apt.contract)
    .map(c => new Date(c.commencement))
    .reduce((earliest, curr) => (curr < earliest ? curr : earliest), fallback);

const getStartDate = (timeRange: TimeRangeEnum, apartments: Apartment[], now: Date): Date => {
  if (timeRange !== TimeRangeEnum.ALL_DATA) {
    return timeRangeMap[timeRange](now);
  }
  return getEarliestContractDate(apartments, now);
};

export function getPeriodRange(timeRange: TimeRangeEnum, apartments: Apartment[]) {
  const now = new Date();
  const startDate = getStartDate(timeRange, apartments, now);

  return {
    periodStart: startDate.toISOString().slice(0, 10),
    periodEnd: now.toISOString().slice(0, 10),
  };
}

export function findMinMaxRentWithFivePercent(
  apartments: Apartment[],
  periodStart: string,
  periodEnd: string,
) {
  const matchingPayments = apartments
    .flatMap(apt => apt.contract)
    .filter(c => c.termination >= periodStart && c.commencement <= periodEnd)
    .map(c => c.monthlyPayment);

  if (matchingPayments.length === 0) return null;

  const min = Math.min(...matchingPayments);
  const max = Math.max(...matchingPayments);

  return {
    min: +(min * 0.95).toFixed(2),
    max: +(max * 1.05).toFixed(2),
  };
}

export function generateChartData(
  apartments: Apartment[],
  timeRange: TimeRangeEnum,
): ChartDataPoint[] {
  const now = new Date();
  const startDate = getStartDate(timeRange, apartments, now);

  const monthCount =
    (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth() + 1;

  const allDates = Array.from({ length: monthCount }).map((_, monthIdx) => {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + monthIdx);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const uniqueSortedDates = allDates.sort((a, b) => a - b);

  return uniqueSortedDates.map(timestamp => {
    const point: ChartDataPoint = { date: timestamp };
    const currentDate = new Date(timestamp);

    apartments.forEach(apt => {
      const activeContract = apt.contract.find(c => {
        const start = new Date(c.commencement);
        const end = new Date(c.termination);
        return currentDate >= start && currentDate <= end;
      });

      if (activeContract) {
        point[apt.id] = activeContract.monthlyPayment;
        point[`${apt.id}_contract`] = activeContract;
        point[`${apt.id}_apartment`] = apt.apartmentName;
      } else {
        point[apt.id] = null;
      }
    });

    return point;
  });
}

export function generateOptimalTicks(
  minDate: number,
  maxDate: number,
  containerWidth: number,
  isMobile: boolean,
): number[] {
  const startDate = new Date(minDate);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(maxDate);
  endDate.setDate(1);
  endDate.setHours(0, 0, 0, 0);

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (totalMonths <= 0) {
    return [startDate.getTime()];
  }

  const MIN_TICK_SPACING = isMobile ? 80 : 120;
  let maxTicks = Math.floor(containerWidth / MIN_TICK_SPACING);
  maxTicks = Math.min(maxTicks, 12);
  maxTicks = Math.max(maxTicks, 3);

  const intervals = maxTicks - 1;
  const stepMonths = Math.ceil(totalMonths / intervals);

  const ticks = Array.from({ length: maxTicks }).map((_, i) => {
    const monthsBack = i * stepMonths;
    const tickDate = new Date(endDate);
    tickDate.setMonth(tickDate.getMonth() - monthsBack);
    return tickDate.getTime();
  });

  if (ticks[0] < startDate.getTime()) {
    ticks[0] = startDate.getTime();
  }

  return ticks;
}

export function formatTickDate(value: number): string {
  return new Date(value)
    .toLocaleDateString('uk-UA', {
      month: 'short',
      year: '2-digit',
    })
    .replace(' р.', '');
}

export const isContract = (value: unknown): value is Contract => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'renter' in value &&
    'commencement' in value &&
    'termination' in value &&
    typeof (value as Contract).commencement === 'string' &&
    typeof (value as Contract).termination === 'string' &&
    'monthlyPayment' in value &&
    typeof (value as Contract).monthlyPayment === 'number'
  );
};
