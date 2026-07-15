'use client';

import { ErrorState } from '@/components/chart-states/ErrorState';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

import { useToastOnError } from '@/hooks';
import { UTILITY_CONFIG } from '@/shared/constants/utilities';
import { formatMonthShort } from '@/shared/utils/meters/format-month';
import { useGetUtilitySummaryQuery } from '@/store/api/meters-api';
import { UtilityType } from '@/types/services/meters';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { UtilitiesSummaryTooltip } from './UtilitiesSummaryTooltip';

type Props = {
  houseId: string;
};

const ChartSkeleton = () => (
  <Card className="w-full" aria-busy="true" aria-label="Завантаження...">
    <CardHeader>
      <div className="flex flex-col gap-3">
        <CardTitle>
          <Skeleton className="h-5 w-64" />
        </CardTitle>
        <Skeleton className="h-4 w-[420px] max-w-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[280px] w-full" />
    </CardContent>
  </Card>
);

export const UtilitiesSummaryChart = ({ houseId }: Props) => {
  const { data, isLoading, isError, error } = useGetUtilitySummaryQuery(houseId);

  useToastOnError(
    isError,
    'Не вдалось завантажити графік витрат на комуналку',
    'UtilitiesSummaryChart',
  );

  const months = useMemo(() => data?.data ?? [], [data]);

  // Плоскі ключі по типах послуг для стекових барів
  const chartData = useMemo(() => months.map(month => ({ ...month, ...month.costs })), [months]);

  // Типи, що реально присутні в даних, у стабільному порядку enum
  const presentTypes = useMemo(
    () =>
      Object.values(UtilityType).filter(type => months.some(month => Boolean(month.costs?.[type]))),
    [months],
  );

  if (isLoading) return <ChartSkeleton />;
  if (isError) return <ErrorState className="w-full" error={error} />;
  if (months.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Витрати на комуналку по місяцях</CardTitle>
          <CardDescription>
            Загальна сума за всі послуги; наведіть на стовпчик, щоб побачити розбивку.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthShort}
                tick={{ fontSize: 12, fill: 'var(--text)', fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)', strokeWidth: 2 }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text)', fontWeight: 500 }}
                tickFormatter={(value: number) => value.toLocaleString('uk-UA')}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <Tooltip
                content={<UtilitiesSummaryTooltip />}
                cursor={{ fill: 'var(--border)', opacity: 0.35 }}
              />
              {presentTypes.map((type, index) => (
                <Bar
                  key={type}
                  dataKey={type}
                  stackId="total"
                  fill={UTILITY_CONFIG[type].chartColor}
                  radius={index === presentTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  maxBarSize={56}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {presentTypes.map(type => {
            const config = UTILITY_CONFIG[type];
            return (
              <span key={type} className="flex items-center gap-1.5 text-xs text-text">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: config.chartColor }}
                />
                {config.label}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
