'use client';
import { useEffect, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { HousesPerformanceTable } from './houses-performance-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { HousesPerformanceTableColumns } from '@/constants/apartment/houses-performance-analytic';
import { useHousesPerformance } from '@/hooks/all-apartments/houses-performance-analytic/use-houses-performance';

const PAGE_SIZE = 10;

export const HousesPerformanceAnalytic = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [limit, setLimit] = useState<number>(PAGE_SIZE);

  const { data, trigger, pageCount, isFetching, isError, error, isEmpty } = useHousesPerformance();

  useEffect(() => {
    setPageIndex(0);

    trigger({
      pageIndex: 0,
      pageSize: limit,
    });
  }, [limit]);

  const table = useReactTable({
    data: data ?? [],
    columns: HousesPerformanceTableColumns,

    manualPagination: true,
    pageCount: pageCount ?? 1,

    state: {
      pagination: {
        pageIndex,
        pageSize: limit,
      },
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex, pageSize: limit }) : updater;

      setPageIndex(next.pageIndex);

      trigger({
        pageIndex: next.pageIndex,
        pageSize: limit,
      });
    },

    getCoreRowModel: getCoreRowModel(),
  });

  if (isFetching) return <LoadingState className="w-full" />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Показники будинків</CardTitle>
      </CardHeader>

      <CardContent>
        <HousesPerformanceTable table={table} limit={limit} setLimit={setLimit} />
      </CardContent>
    </Card>
  );
};
