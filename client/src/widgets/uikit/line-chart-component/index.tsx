/* eslint-disable */
'use client';
import { useApartmentRental } from '@/hooks/use-apartment-rental';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { formatTickDate } from '@/shared/utils/line-chart/line-chart';
import { cn } from '@/shared/utils/cn';
import { useGetHousesAnalyticsQuery } from '@/store/all-analitics';

import { Apartment, TimeRangeEnum } from '@/types/core/line-chart';

import { LegendContent } from '@/widgets/line-chart/legentContent';

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
import { CustomTooltip } from '@/widgets/line-chart/custom-tooltip';
import { getPaletteColors } from '@/shared/utils/line-chart/colors';
import { useIsMobile } from '@/hooks/use-mobile';

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
  } = useApartmentRental(data?.housesOverview || []);

  const paletteColors = getPaletteColors();
  const { isMobile } = useIsMobile();

  const handleApartmentClick = useCallback(
    (id: string) => {
      setLockedApartment(prev => (prev === id ? null : id));
    },
    [setLockedApartment],
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          Завантаження аналітики...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px] text-red-500">
          Помилка завантаження даних
        </CardContent>
      </Card>
    );
  }

  if (!data?.housesOverview?.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          Немає даних для відображення
        </CardContent>
      </Card>
    );
  }

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
                tick={{ fontSize: !isMobile ? 12 : 10, dy: !isMobile ? -20 : -8 }}
                tickFormatter={(value: number) => `${value}`}
                axisLine={false}
                tickLine={false}
              />

              <ReferenceLine y={yDomain[1]} stroke="var(--border)" strokeWidth={1} />
              <ReferenceLine y={yTicks[1]} stroke="var(--border)" strokeWidth={1} />

              <Tooltip
                content={
                  <CustomTooltip
                    lockedApartment={lockedApartment}
                    apartmentsData={data.housesOverview}
                    cursorDate={cursorDate}
                  />
                }
                cursor={{
                  stroke: 'var(--border)',
                  strokeWidth: 1,
                }}
                position={{ y: isMobile ? 170 : 0 }}
              />

              {data.housesOverview.map((apt: Apartment, idx: number) => (
                <Line
                  key={apt.id + timeRange}
                  dataKey={apt.id}
                  connectNulls={true}
                  type="basis"
                  stroke={paletteColors[idx % paletteColors.length]}
                  strokeWidth={lockedApartment === apt.id ? 2.5 : 1.5}
                  strokeOpacity={lockedApartment && lockedApartment !== apt.id ? 0.15 : 1}
                  dot={false}
                  activeDot={lockedApartment && lockedApartment !== apt.id ? false : true}
                />
              ))}

              <Legend
                verticalAlign="bottom"
                align="center"
                content={() => (
                  <LegendContent
                    apartmentsData={data.housesOverview}
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
