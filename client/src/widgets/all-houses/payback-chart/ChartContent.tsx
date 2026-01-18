import { ChartCoordinatesProps } from '@/shared/utils/all-house/payback-chart/chartHelpers';
import { formatYAxis } from '@/shared/utils/all-house/payback-chart/payback';
import { Currencies } from '@/types/core/currencies';
import { PaybackChartData } from '@/types/core/payback-chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomBar } from './CustomBar';
import { PaybackChartTooltip } from './PaybackChartTooltip';

const CHART_CURRENCY: Currencies = 'UAH';

type ChartContentProps = {
  paddedChartData: PaybackChartData[];
  chartMarginWithLegend: { top: number; right: number; left: number; bottom: number };
  scaleType: 'linear' | 'log';
  yAxisDomain: [number | string, number | string];
  horizontalCoordinatesGenerator: (props: ChartCoordinatesProps) => number[];
  activeApartment: string | null;
  totalChartHeight: number;
};

export const ChartContent = ({
  paddedChartData,
  chartMarginWithLegend,
  scaleType,
  yAxisDomain,
  horizontalCoordinatesGenerator,
  activeApartment,
  totalChartHeight,
}: ChartContentProps) => (
  <ResponsiveContainer width="100%" height={totalChartHeight}>
    <BarChart data={paddedChartData} margin={chartMarginWithLegend} barSize={20}>
      <CartesianGrid
        stroke="var(--border)"
        strokeDasharray="0"
        vertical={false}
        horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
      />
      <XAxis dataKey="apartmentName" hide />
      <YAxis
        scale={scaleType}
        domain={yAxisDomain}
        tickFormatter={value => formatYAxis(value, CHART_CURRENCY)}
        axisLine={false}
        tickLine={false}
        width={65}
        tick={{
          fontSize: 12,
          fill: 'var(--text)',
          fontWeight: 500,
        }}
      />
      <Tooltip
        content={<PaybackChartTooltip />}
        cursor={false}
        allowEscapeViewBox={{ x: false, y: false }}
      />
      <Bar
        dataKey="purchasePriceUSD"
        shape={(props: unknown) => (
          <CustomBar {...(props as object)} activeApartment={activeApartment} />
        )}
      />
    </BarChart>
  </ResponsiveContainer>
);
