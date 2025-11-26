export const ROW_HEIGHT = 45;
export const MIN_VISIBLE_ROWS = 4;
export const MAX_VISIBLE_ROWS = 7;
export const Y_AXIS_PADDING = 0.15;
export const MILLION = 1_000_000;
export const CHART_PADDING = 30;

export const computeChartHeight = (dataLength: number): number => {
  return dataLength * ROW_HEIGHT + CHART_PADDING;
};

export const computeContainerHeight = (actualRows: number): number => {
  const displayRows = Math.min(Math.max(actualRows, MIN_VISIBLE_ROWS), MAX_VISIBLE_ROWS);
  return displayRows * ROW_HEIGHT + CHART_PADDING;
};

export const computeXAxisMax = (
  chartData: Array<{ purchaseAmount: number; revaluationAmount: number }>,
): number => {
  if (chartData.length === 0) {
    return MILLION;
  }

  const maxValue = chartData.reduce((max, item) => {
    const currentMax = Math.max(item.purchaseAmount, item.revaluationAmount);
    return Math.max(max, currentMax);
  }, 0);

  if (maxValue === 0) {
    return MILLION;
  }

  return Math.ceil((maxValue * (1 + Y_AXIS_PADDING)) / MILLION) * MILLION;
};

export const getBarColors = (isDark: boolean) => ({
  purchase: isDark ? 'rgba(198, 199, 248, 0.34)' : 'var(--dark)',
  growth: isDark ? 'var(--purple-medium)' : 'var(--dark-light)',
});
