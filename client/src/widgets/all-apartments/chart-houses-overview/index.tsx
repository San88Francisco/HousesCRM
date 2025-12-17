/* eslint-disable */
'use client';
import { useApartmentRental } from '@/hooks/all-apartments/houses-overview/use-apartment-rental';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { formatTickDate } from '@/shared/utils/all-apartments/houses-overview/chart-houses-overview';
import { cn } from '@/shared/utils/cn';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';

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
import { HouseOverviewChartDataItem, TimeRangeEnum } from '@/types/core/houses-overview/types';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { LegendContent } from './LegendContent';
import { CustomTooltip } from './houses-overview-tooltip';

export function ApartmentRentalChart() {
  const { data, error, isLoading } = useGetHousesAnalyticsQuery();

  const {
    timeRange,
    setTimeRange,
    chartData,
    lockedApartment,
    setLockedApartment,
    yDomain,
    yTicks,
    chartRef,
    cursorDate,
    optimalTicks,
    chartMouseHandlers,
    dataMin,
    dataMax,
    isMobile,
    apartmentsDataWithFill,
  } = useApartmentRental(data ?? {});

  const handleApartmentClick = useCallback(
    (id: string) => {
      setLockedApartment(prev => (prev === id ? null : id));
    },
    [setLockedApartment],
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
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)', strokeWidth: 2 }}
                textAnchor="middle"
              />

              <YAxis
                domain={yDomain}
                ticks={yTicks}
                tickMargin={10}
                tick={{ fontSize: isMobile ? 10 : 12, dy: isMobile ? -8 : -20 }}
                tickFormatter={(value: number) => String(value)}
                axisLine={false}
                tickLine={false}
              />

              <ReferenceLine y={yDomain[1]} stroke="var(--border)" strokeWidth={1} />
              <ReferenceLine y={yTicks[1]} stroke="var(--border)" strokeWidth={1} />

              <Tooltip
                content={
                  <CustomTooltip
                    lockedApartment={lockedApartment}
                    apartmentsData={apartmentsDataWithFill}
                    cursorDate={cursorDate}
                  />
                }
                cursor={{
                  stroke: 'var(--border)',
                  strokeWidth: 1,
                }}
                position={{ y: isMobile ? 170 : 0 }}
              />

              {apartmentsDataWithFill.map((apt: HouseOverviewChartDataItem) => (
                <Line
                  key={apt.id + timeRange}
                  dataKey={apt.id}
                  connectNulls={true}
                  type="basis"
                  stroke={apt.fill}
                  strokeWidth={lockedApartment === apt.id ? 2.5 : 1.5}
                  strokeOpacity={lockedApartment && lockedApartment !== apt.id ? 0.15 : 1}
                  dot={false}
                  activeDot={!lockedApartment || lockedApartment === apt.id}
                />
              ))}

              <Legend
                verticalAlign="bottom"
                align="center"
                content={() => (
                  <LegendContent
                    apartmentsData={apartmentsDataWithFill}
                    activeApartment={lockedApartment}
                    onApartmentClick={handleApartmentClick}
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
