'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './PieChart';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './CardPieChart';

export const description = 'A donut chart with text';

const chartData = [
  { apatmentName: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { apatmentName: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { apatmentName: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { apatmentName: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { apatmentName: 'other', visitors: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
  chrome: {
    label: 'Chrome',
    theme: {
      light: 'var(--purple)',
      dark: 'var(--purple-light)',
    },
  },
  safari: {
    label: 'Safari',
    theme: {
      light: 'var(--blue)',
      dark: 'var(--blue-light)',
    },
  },
  firefox: {
    label: 'Firefox',
    theme: {
      light: 'var(--green-light)',
      dark: 'var(--green)',
    },
  },
  edge: {
    label: 'Edge',
    theme: {
      light: 'var(--yellow)',
      dark: 'var(--purple-medium)',
    },
  },
  other: {
    label: 'Other',
    theme: {
      light: 'var(--dark-light)',
      dark: 'var(--white-light)',
    },
  },
} satisfies ChartConfig;

export function ChartPieDonutText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="apatmentName"
              innerRadius={75} // внутрішній радіус, щоб зробити "donut"
              outerRadius={100} // зовнішній радіус
              paddingAngle={5} // відстань між секторами
              cornerRadius={5} // заокруглення ліній
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy} className="text text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-background"
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text leading-none">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}
