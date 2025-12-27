import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  transformCurrencyData,
  computeXAxisMax,
  computeContainerHeight,
  computeChartHeight,
  getBarColors,
  MIN_VISIBLE_ROWS,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';

export const useChartData = (apiData: unknown) => {
  return useMemo(() => {
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return [];
    }

    const transformed = transformCurrencyData(apiData);

    return transformed
      .map(item => {
        const rawGrowth = item.revaluationAmount - item.purchaseAmount;
        return {
          ...item,
          growthAmount: Math.max(rawGrowth, 0),
        };
      })
      .reverse();
  }, [apiData]);
};

export const useChartConfig = (chartData: ChartDataItem[]) => {
  const { theme, systemTheme } = useTheme();

  return useMemo(() => {
    const actualRows = chartData.length;
    const xAxisMax = computeXAxisMax(chartData);
    const containerHeight = computeContainerHeight(actualRows);
    const chartHeight = computeChartHeight(Math.max(actualRows, MIN_VISIBLE_ROWS));

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    const { purchase: purchaseBarFill, growth: growthBarFill } = getBarColors(isDark);

    return {
      xAxisMax,
      containerHeight,
      chartHeight,
      isDark,
      purchaseBarFill,
      growthBarFill,
    };
  }, [chartData, theme, systemTheme]);
};
