'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './PieChart';
import { normalizeChartData } from '@/shared/utils/pie-chart/normalizeChartData';
import { chartData } from '@/config/pie-chart/chartData';
import { chartConfig } from '@/config/pie-chart/chartConfig';
import { ChartList } from './ChartList';

export function ChartPieDonutText() {
  // TODO: Код тимчасовий, коли будемо отримувати масив з бекенду, це видалимо, адже там є загальна сума
  const grandApartmentTotalRevenue = chartData.reduce(
    (acc, curr) => acc + curr.apartmentTotalRevenue,
    0,
  );

  const adjustedData = React.useMemo(() => normalizeChartData(chartData), []);

  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader className="items-center pb-0 mb-5">
        <CardTitle>Загальний дохід по всіх квартирах</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap md:flex-nowrap gap-10 items-center">
        <ChartContainer
          config={chartConfig}
          className="flex-shrink-0 w-full md:w-[40%] max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={adjustedData}
              dataKey="apartmentTotalRevenue"
              nameKey="apartmentName"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={5}
              cornerRadius={5}
            >
              <Label
                className="text"
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-current text text-3xl font-bold"
                        >
                          {grandApartmentTotalRevenue.toLocaleString()}₴
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-current text"
                        >
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
        <ChartList chartConfig={chartConfig} chartData={chartData} />
      </CardContent>
    </Card>
  );
}
