import { EmptyState } from '@/components/chart-states/EmptyState';
import { createChartPieConfig } from '@/shared/utils/all-house/pie-chart/create-chart-pie-config';
import { HouseDistributionChartDataItem } from '@/types/model/revenue-distribution/pie-chart-items';
import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './charts';

type Props = {
  adjustedData: HouseDistributionChartDataItem[];
  grandApartmentTotalRevenue: number;
};

export function PieChartRevenue({ adjustedData, grandApartmentTotalRevenue }: Props) {
  const chartConfig = createChartPieConfig(adjustedData);
  const positiveRevenueCount = adjustedData.filter(d => d.apartmentTotalRevenue > 0).length;

  if (grandApartmentTotalRevenue === 0 || positiveRevenueCount === 0) return <EmptyState />;

  return (
    <ChartContainer config={chartConfig} className="flex-shrink-0 w-full lg:w-[50%] max-h-[400px]">
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
