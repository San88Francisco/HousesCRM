import { useChartDimensions } from '@/shared/utils/all-house/payback-chart/utils';
import { Currencies } from '@/types/core/currencies';
import { PaybackChartData } from '@/types/core/payback-chart';
import { useCallback, useMemo } from 'react';

const MIN_ITEMS_FOR_FULL_WIDTH = 8;
const CHART_HEIGHT = 300;
const LEGEND_HEIGHT = 80;
const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 30 };

type ChartCoordinatesProps = {
  yAxis?: {
    scale?: {
      ticks?: (count: number) => number[];
      (value: number): number;
    };
  };
};

export const createEmptyItem = (index: number, currency: Currencies): PaybackChartData => ({
  id: `empty-${index}`,
  apartmentName: '',
  paybackCoefficient: 0,
  displayCoefficient: 0,
  isFullyPaidBack: false,
  color: 'transparent',
  purchaseDate: '',
  purchasePriceUSD: 0,
  totalIncomeUSD: 0,
  currencySymbol: '',
  currencyCode: currency,
  isEmpty: true,
});

export const usePaddedData = (data: PaybackChartData[], currency: Currencies) => {
  return useMemo(() => {
    if (data.length >= MIN_ITEMS_FOR_FULL_WIDTH) return data;

    const emptyCount = MIN_ITEMS_FOR_FULL_WIDTH - data.length;
    const emptyItems = Array.from({ length: emptyCount }, (_, i) => createEmptyItem(i, currency));

    return [...data, ...emptyItems];
  }, [data, currency]);
};

export const useCoordinatesGenerator = (yAxisMax: number) => {
  return useCallback(
    (props: ChartCoordinatesProps) => {
      const scale = props?.yAxis?.scale;
      if (!scale) return [];

      const ticks = scale.ticks?.(6) ?? [];
      return ticks.filter((tick: number) => tick < yAxisMax).map((tick: number) => scale(tick));
    },
    [yAxisMax],
  );
};

export const useChartConfig = (chartData: PaybackChartData[]) => {
  const { yAxisMax, yAxisMin, minChartWidth, scaleType } = useChartDimensions(chartData);
  const yAxisDomain: [number | string, number | string] = [yAxisMin, yAxisMax];
  const totalChartHeight = CHART_HEIGHT + LEGEND_HEIGHT;
  const chartMarginWithLegend = { ...CHART_MARGIN, bottom: LEGEND_HEIGHT };

  return {
    yAxisMax,
    yAxisMin,
    minChartWidth,
    scaleType,
    yAxisDomain,
    totalChartHeight,
    chartMarginWithLegend,
  };
};

export const LEGEND_MARGIN_TOP = -70;
