import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './charts';
import { createChartPieConfig } from '@/shared/utils/all-apartments/pie-chart/create-chart-pie-config';
import { HouseChartDataItem } from '@/types/core/chart-pie-item';
import { EmptyState } from '../currency-revaluation-chart/ChartStates';

type Props = {
  adjustedData: HouseChartDataItem[];
  grandApartmentTotalRevenue: number;
};

export function PieChartRevenue({ adjustedData, grandApartmentTotalRevenue }: Props) {
  const chartConfig = createChartPieConfig(adjustedData);
  const positiveRevenueCount = adjustedData.filter(d => d.apartmentTotalRevenue > 0).length;

  // Якщо немає доходу взагалі
  if (grandApartmentTotalRevenue === 0 || positiveRevenueCount === 0) {
    return (
      <EmptyState />
      // <div className="flex-shrink-0 w-full md:w-[40%] max-h-[300px] flex items-center justify-center">
      //   <div className="text-center space-y-3 p-6">
      //     <div className="mx-auto w-20 h-20 rounded-full bg-[var(--muted)] flex items-center justify-center">
      //       <TrendingUp className="w-10 h-10 text-[var(--muted-text)]" />
      //     </div>
      //     <p className="text-sm text-[var(--muted-text)]">Немає даних про дохід</p>
      //     <p className="text-xs text-[var(--muted-text)]">
      //       Додайте договори оренди для відображення статистики
      //     </p>
      //   </div>
      // </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="flex-shrink-0 w-full md:w-[40%] max-h-[300px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={adjustedData}
          dataKey="apartmentTotalRevenue"
          nameKey="apartmentName"
          innerRadius={75}
          outerRadius={100}
          paddingAngle={positiveRevenueCount > 1 ? 5 : 0}
          cornerRadius={5}
          minAngle={5}
        >
          <Label
            className="text"
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-current text text-3xl font-bold"
                    >
                      {grandApartmentTotalRevenue.toLocaleString()}₴
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-current text">
                      Загальний дохід
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
