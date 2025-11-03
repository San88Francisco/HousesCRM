import { useEffect, useState, useMemo } from 'react';
import { PaybackChartData } from '@/types/core/analytics';
import { transformPaybackData } from '@/shared/utils/payback';
import { mockPaybackStats } from '@/shared/mocks/analytics.mock';
import { useTheme } from 'next-themes';

const LOADING_DELAY = 500;
const Y_AXIS_ROUNDING = 100000;
const CHART_WIDTH_MULTIPLIER = 80;
const MIN_CHART_WIDTH = 800;

export const usePaybackChart = () => {
  const [data, setData] = useState<PaybackChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => {
        setTimeout(resolve, LOADING_DELAY);
      });
      const transformedData = transformPaybackData(mockPaybackStats);
      setData(transformedData);
      setLoading(false);
    };

    void loadData();
  }, []);

  const { yAxisMax, minChartWidth } = useMemo(() => {
    if (data.length === 0) {
      return { yAxisMax: Y_AXIS_ROUNDING, minChartWidth: MIN_CHART_WIDTH };
    }
    const maxPrice = Math.max(...data.map(d => d.purchasePriceUSD));
    const calculatedYAxisMax = Math.ceil(maxPrice / Y_AXIS_ROUNDING) * Y_AXIS_ROUNDING;
    const calculatedMinChartWidth = Math.max(MIN_CHART_WIDTH, data.length * CHART_WIDTH_MULTIPLIER);

    return { yAxisMax: calculatedYAxisMax, minChartWidth: calculatedMinChartWidth };
  }, [data]);

  return { data, loading, mounted, isDark, yAxisMax, minChartWidth };
};
