/* eslint-disable */

'use client';

import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart as PieChartRecharts, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { type FC, useMemo, useState } from 'react';
import { DropdownSelect } from '../DropdownSelect/DropdownSelect';
import { dateRanges } from '@/constants/pieChart/dateRanges';
import type { DateRangeWithMonth } from '@/constants/allApartmentsDescriptionPieChart/allApartmentsDescriptionPieChart';

export type DateYear = '1y' | '5y' | '10y' | 'all';
export type YearlyData = {
  date: string;
  value: number;
};

export type ChartData = {
  [key: string]: {
    [key in DateRangeWithMonth]: YearlyData[];
  };
};

type Props = {
  data: ChartData;
  title: string;
  description: (range: DateRangeWithMonth) => string;
};

const timeRanges: DateRangeWithMonth[] = ['1m', '1y', '5y', '10y', 'all'];

export const PieChart: FC<Props> = ({ data, title, description }) => {
  const [selectedRange, setSelectedRange] = useState<DateRangeWithMonth>('1y');

  const chartData = useMemo(() => {
    const calculateEarningsForRange = (person: string, range: DateRangeWithMonth) => {
      const personData = data[person][range];
      if (range === '1m') {
        // For 1 month, return the last (most recent) value
        return personData[personData.length - 1].value;
      } else {
        // For other ranges, sum up all values
        return personData.reduce((sum, item) => sum + item.value, 0);
      }
    };

    const khasevichEarnings = calculateEarningsForRange('Khasevich', selectedRange);
    const bossEarnings = calculateEarningsForRange('Boss', selectedRange);
    const totalEarnings = khasevichEarnings + bossEarnings;

    return [
      {
        name: 'Khasevich',
        value: khasevichEarnings,
        percentage: (khasevichEarnings / totalEarnings) * 100,
      },
      { name: 'Boss', value: bossEarnings, percentage: (bossEarnings / totalEarnings) * 100 },
    ];
  }, [data, selectedRange]);

  const totalEarned = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const chartConfig: ChartConfig = {
    Khasevich: { label: 'Khasevich', color: '#F9A8D4' },
    Boss: { label: 'Boss', color: '#F4B183' },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className="flex flex-col mt-5 w-[60%]">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <h2>{title}</h2>
            </CardTitle>
            <CardDescription>
              <h5>{description(selectedRange)}</h5>
            </CardDescription>
          </div>
          <DropdownSelect<DateRangeWithMonth>
            options={dateRanges}
            value={selectedRange}
            onChange={setSelectedRange}
            className="w-[150px]"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChartRecharts>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  valueFormatter={value =>
                    `${formatCurrency(value)} (${formatPercentage((value / totalEarned) * 100)})`
                  }
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.name as keyof typeof chartConfig].color}
                />
              ))}
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
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground dark:fill-foreground-dark text-3xl font-bold"
                        >
                          {formatCurrency(totalEarned)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {dateRanges.find(range => range.value === selectedRange)?.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChartRecharts>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none dark:text-foreground-dark ">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing earnings distribution for{' '}
          {dateRanges.find(range => range.value === selectedRange)?.label}
        </div>
      </CardFooter>
    </Card>
  );
};
