/* eslint-disable */
'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useApartmentRental } from '@/hooks/use-apartment-rental';
import { Apartment, TimeRangeEnum } from '@/types/core/apartment';
import { CustomTooltip } from '@/widgets/line-chart/castom-tooltip';
import { LegendContent } from '@/widgets/line-chart/legent-content';
import { getPaletteColors } from '@/shared/utils/apartments/colors';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/shared/utils/cn';

export function ApartmentRentalChart() {
  const {
    timeRange,
    setTimeRange,
    chartData,
    lockedApartment,
    setLockedApartment,
    yDomain,
    yTicks,
  } = useApartmentRental(apartmentsData);

  const isMobile = useIsMobile();

  const paletteColors = useMemo(() => getPaletteColors(), []);

  const handleApartmentClick = useCallback(
    (id: string) => {
      setLockedApartment(prev => (prev === id ? null : id));
    },
    [setLockedApartment],
  );

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [cursorDate, setCursorDate] = useState<number>(0);

  const tooltipWrapperStyle = useMemo(() => {
    if (!isMobile) return {};

    return {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      top: 'unset' as const,
      right: 'unset' as const,
      pointerEvents: 'none' as const,
      zIndex: 1000,
    };
  }, [isMobile]);

  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const generateOptimalTicks = (
    minDate: number,
    maxDate: number,
    containerWidth: number,
    isMobile: boolean,
  ) => {
    const ticks: number[] = [minDate, maxDate];

    const start = new Date(minDate);
    const end = new Date(maxDate);
    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    const MIN_TICK_WIDTH = isMobile ? 70 : 100;
    const maxIntervalsByWidth = Math.floor((containerWidth * 0.9) / MIN_TICK_WIDTH); // 90% ширини

    const maxIntervalsByPeriod = totalMonths;

    let bestIntervals = 0;

    for (
      let intervals = Math.min(maxIntervalsByWidth, maxIntervalsByPeriod);
      intervals >= 1;
      intervals--
    ) {
      if (totalMonths % intervals === 0) {
        bestIntervals = intervals;
        break;
      }
    }

    if (bestIntervals > 0) {
      const stepMonths = totalMonths / bestIntervals;

      for (let i = 1; i < bestIntervals; i++) {
        const tickDate = new Date(start);
        tickDate.setMonth(start.getMonth() + i * stepMonths);
        ticks.splice(1 + i - 1, 0, tickDate.getTime());
      }
    }

    return ticks;
  };

  const handleMouseMove = useCallback((e: any) => {
    if (e && e.activeLabel) {
      setCursorDate(e.activeLabel);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorDate(0);
  }, []);

  const optimalTicks = useMemo(() => {
    if (chartWidth === 0 || chartData.length === 0) {
      return [];
    }

    const minDate = Math.min(...chartData.map(d => d.date));
    const maxDate = Math.max(...chartData.map(d => d.date));

    return generateOptimalTicks(minDate, maxDate, chartWidth, isMobile);
  }, [chartWidth, chartData, isMobile]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Історія оренди квартир</CardTitle>
          <CardDescription>Відображення цін на оренду за період: {timeRange}</CardDescription>
        </div>
        <CardAction>
          <Select
            value={timeRange}
            onValueChange={(value: string) => {
              setTimeRange(value as TimeRangeEnum);
            }}
          >
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
          {cursorDate && (
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm border rounded px-3 py-1.5 text-sm z-10">
              Дата:{' '}
              {new Date(cursorDate).toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{ top: 30, right: 5, bottom: 0, left: 0 }}
              key={timeRange}
              data={chartData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                tickFormatter={(value: number) => {
                  const shouldShowOnlyYear = [
                    TimeRangeEnum.FIVE_YEARS,
                    TimeRangeEnum.TEN_YEARS,
                    TimeRangeEnum.FIFTEEN_YEARS,
                    TimeRangeEnum.ALL_DATA,
                  ].includes(timeRange);
                  return shouldShowOnlyYear
                    ? new Date(value).getFullYear().toString()
                    : new Date(value)
                        .toLocaleDateString('uk-UA', {
                          month: 'short',
                          year: '2-digit',
                        })
                        .replace(' р.', '');
                }}
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
