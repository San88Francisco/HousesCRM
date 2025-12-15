import { Label, Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './charts';
import { createChartPieConfig } from '@/shared/utils/pie-chart/create-chart-pie-config';
import { HouseChartDataItem } from '@/types/core/revenue-distribution/chart-pie-item';

type Props = {
  adjustedData: HouseChartDataItem[];
  grandApartmentTotalRevenue: number;
};

export function PieChartRevenue({ adjustedData, grandApartmentTotalRevenue }: Props) {
  const chartConfig = createChartPieConfig(adjustedData);

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
          paddingAngle={adjustedData.length > 1 ? 5 : 0}
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
