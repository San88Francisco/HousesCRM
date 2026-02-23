'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  LEGEND_MARGIN_TOP,
  useChartConfig,
  useCoordinatesGenerator,
  usePaddedData,
} from '@/shared/utils/all-house/payback-chart/chartHelpers';
import {
  useChartScroll,
  usePaybackChartData,
  useScrollNeeded,
} from '@/shared/utils/all-house/payback-chart/utils';
import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';
import { Currencies } from '@/types/core/currencies';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChartContent } from './ChartContent';
import { LegendContent } from './LegendContent';
import { ScrollContainer } from './ScrollContainer';

const CHART_CURRENCY: Currencies = 'UAH';

export const PaybackChart = () => {
  const [mounted, setMounted] = useState(false);
  const [activeApartment, setActiveApartment] = useState<string | null>(null);

  const { data: analyticsData, isLoading, error } = useGetHousesAnalyticsQuery();
  const chartData = usePaybackChartData(analyticsData?.housesPaybackStats, CHART_CURRENCY);
  const { containerRef, isScrollNeeded } = useScrollNeeded(chartData.length);
  const paddedChartData = usePaddedData(chartData, CHART_CURRENCY);
  const {
    yAxisMax,
    scaleType,
    yAxisDomain,
    totalChartHeight,
    chartMarginWithLegend,
    minChartWidth,
  } = useChartConfig(chartData);
  const { scrollRef, isDragging, handlePointerDown, handlePointerMove } = useChartScroll();
  const horizontalCoordinatesGenerator = useCoordinatesGenerator(yAxisMax);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('Невдалось завантажити cтатистику окупності квартир');
    }
  }, [error]);

  const handleApartmentClick = useCallback((id: string) => {
    setActiveApartment(prev => (prev === id ? null : id));
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!chartData?.length) return <EmptyState />;
  if (!mounted) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            Статистика окупності квартир
          </CardTitle>
          <CardDescription>
            Графік відображає період окупності кожної квартири та дозволяє порівняти ефективність
            інвестицій у різні об'єкти
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-4 md:p-6" ref={containerRef}>
        <ScrollContainer
          scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
          isScrollNeeded={isScrollNeeded}
          isDragging={isDragging}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handlePointerMove}
          minChartWidth={minChartWidth}
        >
          <ChartContent
            paddedChartData={paddedChartData}
            chartMarginWithLegend={chartMarginWithLegend}
            scaleType={scaleType}
            yAxisDomain={yAxisDomain}
            horizontalCoordinatesGenerator={horizontalCoordinatesGenerator}
            activeApartment={activeApartment}
            totalChartHeight={totalChartHeight}
          />

          <div
            className="relative pointer-events-auto"
            style={{ marginTop: LEGEND_MARGIN_TOP, zIndex: 10 }}
            onPointerDown={e => e.stopPropagation()}
            onPointerMove={e => e.stopPropagation()}
          >
            <LegendContent
              apartmentsData={chartData}
              activeApartment={activeApartment}
              onApartmentClick={handleApartmentClick}
            />
          </div>
        </ScrollContainer>
      </CardContent>
    </Card>
  );
};
