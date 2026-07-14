import { LastMeterReading } from '@/shared/validation/meter-reading';

const round2 = (value: number) => Math.round(value * 100) / 100;

export type ReadingPreview = {
  numericValue: number;
  consumption: number | null;
  cost: number | null;
};

export const computeReadingPreview = (
  metered: boolean,
  lastReading: LastMeterReading | null,
  watchedValue: number | null | undefined,
  tariffPrice: number | null,
): ReadingPreview => {
  const numericValue =
    watchedValue === null || watchedValue === undefined ? NaN : Number(watchedValue);

  const canCompute =
    metered &&
    lastReading !== null &&
    !Number.isNaN(numericValue) &&
    numericValue >= lastReading.value;

  const consumption = canCompute ? round2(numericValue - lastReading.value) : null;
  const cost =
    consumption !== null && tariffPrice !== null ? round2(consumption * tariffPrice) : null;

  return { numericValue, consumption, cost };
};
