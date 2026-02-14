import { createChartPieConfig } from '@/shared/utils/all-house/pie-chart/create-chart-pie-config';
import { HouseDistributionDataItemChart } from '@/types/model/revenue-distribution';
import { Label, Pie, PieChart } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ContainerCharts } from './ContainerCharts';

type Props = {
  adjustedData: HouseDistributionDataItemChart[];
  grandApartmentTotalRevenue: number;
  positiveRevenueCount: number;
};

export const PieRevenueChart = ({
  adjustedData,
  grandApartmentTotalRevenue,
  positiveRevenueCount,
}: Props) => {
  const chartConfig = createChartPieConfig(adjustedData);

  return (
    <ContainerCharts config={chartConfig} className="flex-shrink-0 w-full lg:w-[50%] max-h-[400px]">
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
    </ContainerCharts>
  );
};
