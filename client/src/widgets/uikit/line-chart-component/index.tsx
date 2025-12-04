/* eslint-disable */
'use client';
import { useApartmentRental } from '@/hooks/use-apartment-rental';
import { apartmentsData } from '@/shared/constants/all-apartments-description-chart/line-chart';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { formatTickDate } from '@/shared/utils/apartments/period';
import { cn } from '@/shared/utils/cn';
import { Apartment, TimeRangeEnum } from '@/types/core/apartment';
import { CustomTooltip } from '@/widgets/line-chart/castom-tooltip';
import { LegendContent } from '@/widgets/line-chart/legent-content';

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

export function ApartmentRentalChart() {
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
    paletteColors,
    optimalTicks,
    tooltipWrapperStyle,
    chartMouseHandlers,
    isMobile,
  } = useApartmentRental(apartmentsData);

  const handleApartmentClick = useCallback(
    (id: string) => {
      setLockedApartment(prev => (prev === id ? null : id));
    },
    [setLockedApartment],
  );

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
              margin={{ top: 30, right: 5, bottom: 0, left: 0 }}
              key={timeRange}
              data={chartData}
              {...chartMouseHandlers}
            >
              <XAxis
                dataKey="date"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickMargin={10}
                tick={{ fontSize: !isMobile ? 14 : 12 }}
                ticks={optimalTicks}
                interval="preserveStartEnd"
                tickFormatter={formatTickDate}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)', strokeWidth: 2 }}
                textAnchor="middle"
              />

              <YAxis
                domain={yDomain}
                ticks={yTicks}
                tickMargin={10}
                tick={{ fontSize: !isMobile ? 14 : 12, dy: !isMobile ? -20 : undefined }}
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
                    apartmentsData={apartmentsData}
                    colors={paletteColors}
                    cursorDate={cursorDate}
                  />
                }
                wrapperStyle={tooltipWrapperStyle}
                cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }}
              />

              {apartmentsData.map((apt: Apartment, idx: number) => (
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
                    apartmentsData={apartmentsData}
                    colors={paletteColors}
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
