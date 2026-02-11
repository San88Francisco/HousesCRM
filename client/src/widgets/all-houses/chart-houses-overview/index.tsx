'use client';
import { useHouseRental } from '@/hooks/all-house/houses-overview/use-house-rental';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { formatTickDate } from '@/shared/utils/all-house/houses-overview/chart-houses-overview';
import { cn } from '@/shared/utils/cn';
import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { TimeRangeEnum } from '@/types/core/time-range';
import { HouseOverviewChartDataItem } from '@/types/model/houses-overview';
import { useCallback } from 'react';
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LegendContent } from './LegendContent';
import { CustomTooltip } from './houses-overview-tooltip';

export function HouseRentalChart() {
  const { data, error, isLoading } = useGetHousesAnalyticsQuery();

  const {
    timeRange,
    setTimeRange,
    chartData,
    lockedHouse,
    setLockedHouse,
    yDomain,
    yTicks,
    chartRef,
    cursorDate,
    optimalTicks,
    chartMouseHandlers,
    dataMin,
    dataMax,
    isMobile,
    housesDataWithFill,
  } = useHouseRental(data ?? {});

  const handleHouseClick = useCallback(
    (id: string) => {
      setLockedHouse(prev => (prev === id ? null : id));
    },
    [setLockedHouse],
  );

  if (isLoading) return <LoadingState className="w-full" />;

  if (error) return <ErrorState className="w-full" error={error} />;

  if (!data?.housesOverview?.length) return <EmptyState className="w-full" />;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Історія оренди квартир</CardTitle>
          <CardDescription>Відображення цін на оренду за період: {timeRange}</CardDescription>
        </div>
        <CardAction>
          <Select value={timeRange} onValueChange={value => setTimeRange(value as TimeRangeEnum)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Вибери період" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TimeRangeEnum).map(value => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className={cn(isMobile && 'p-0')}>
        <div ref={chartRef} className="w-full h-[330px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{ top: 30, right: 25, bottom: 0, left: 0 }}
              key={timeRange}
              data={chartData}
              {...chartMouseHandlers}
            >
              <XAxis
                dataKey="date"
                type="number"
                domain={[dataMin, dataMax]}
                ticks={optimalTicks}
                interval={0}
                allowDuplicatedCategory={false}
                tickFormatter={formatTickDate}
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#fff', fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)', strokeWidth: 2 }}
                textAnchor="middle"
              />

              <YAxis
                domain={yDomain}
                ticks={yTicks}
                tickMargin={10}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  dy: isMobile ? -8 : -20,
                  fill: '#fff',
                  fontWeight: 500,
                }}
                tickFormatter={(value: number) => value.toLocaleString('en-US').replace(/,/g, ' ')}
                axisLine={false}
                tickLine={false}
              />

              <ReferenceLine y={yDomain[1]} stroke="var(--border)" strokeWidth={1} />
              <ReferenceLine y={yTicks[1]} stroke="var(--border)" strokeWidth={1} />

              <Tooltip
                content={
                  <CustomTooltip
                    lockedHouse={lockedHouse}
                    housesData={housesDataWithFill}
                    cursorDate={cursorDate}
                  />
                }
                cursor={{
                  stroke: 'var(--border)',
                  strokeWidth: 1,
                }}
                position={{ y: isMobile ? 170 : 0 }}
              />

              {housesDataWithFill.map((apt: HouseOverviewChartDataItem) => (
                <Line
                  key={apt.id + timeRange}
                  dataKey={apt.id}
                  connectNulls={true}
                  type="basis"
                  stroke={apt.fill}
                  strokeWidth={lockedHouse === apt.id ? 2.5 : 1.5}
                  strokeOpacity={lockedHouse && lockedHouse !== apt.id ? 0.15 : 1}
                  dot={false}
                  activeDot={!lockedHouse || lockedHouse === apt.id}
                />
              ))}

              <Legend
                verticalAlign="bottom"
                align="center"
                content={() => (
                  <LegendContent
                    housesData={housesDataWithFill}
                    activeHouse={lockedHouse}
                    onHouseClick={handleHouseClick}
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
