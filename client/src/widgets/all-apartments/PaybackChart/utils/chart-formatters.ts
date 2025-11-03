const MILLION = 1_000_000;
const THOUSAND = 1_000;
const ONE_DECIMAL = 1;
const ZERO_DECIMAL = 0;

export const formatYAxisTick = (value: number): string => {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(ONE_DECIMAL)}M`;
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(ZERO_DECIMAL)}k`;
  }
  return value.toString();
};
