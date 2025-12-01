import { Apartment, ChartDataPoint, Contract, TimeRangeEnum } from '@/types/core/apartment';

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

export function getPeriodRange(timeRange: TimeRangeEnum, apartments: Apartment[]) {
  const now = new Date('2025-11-07');
  const startDate =
    timeRange !== TimeRangeEnum.ALL_DATA
      ? timeRangeMap[timeRange](now)
      : apartments
          .flatMap(apt => apt.contracts)
          .map(c => new Date(c.commencement))
          .reduce((earliest, curr) => (curr < earliest ? curr : earliest), now);

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
    .flatMap(apt => apt.contracts)
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
  const now = new Date('2025-11-07');
  const startDate =
    timeRange !== TimeRangeEnum.ALL_DATA
      ? timeRangeMap[timeRange](now)
      : apartments
          .flatMap(apt => apt.contracts)
          .map(c => new Date(c.commencement))
          .reduce((earliest, curr) => (curr < earliest ? curr : earliest), now);

  const allDates = apartments
    .flatMap(apt =>
      apt.contracts.flatMap((contract: Contract) => {
        const start = new Date(contract.commencement);
        const end = new Date(contract.termination);
        return [
          ...(start >= startDate && start <= now ? [start.getTime()] : []),
          ...(end >= startDate && end <= now ? [end.getTime()] : []),
        ];
      }),
    )
    .concat(
      Array.from(
        {
          length:
            (now.getFullYear() - startDate.getFullYear()) * 12 +
            now.getMonth() -
            startDate.getMonth() +
            1,
        },
        (_, i) => {
          const dt = new Date(startDate);
          dt.setMonth(dt.getMonth() + i);
          dt.setDate(1);
          return dt.getTime();
        },
      ),
    );

  const uniqueSortedDates = Array.from(new Set(allDates)).sort((a, b) => a - b);

  return uniqueSortedDates.map(timestamp => {
    const point: ChartDataPoint = { date: timestamp };
    const currentDate = new Date(timestamp);

    apartments.forEach(apt => {
      const activeContract = apt.contracts.find(c => {
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
