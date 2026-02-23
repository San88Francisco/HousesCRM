'use client';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { useHousesPerformance } from '@/hooks/all-house/houses-performance-analytic/use-houses-performance';

import { HousesPerformanceTableColumns } from '@/shared/constants/apartment/houses-performance-analytic';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { HousesPerformanceTableSkeleton } from '@/widgets/skeletons/houses-performance-table-skeleton';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HousesPerformanceTable } from './HousesPerformanceTable';

export const HousesPerformanceAnalytic = () => {
  const [pageIndex, setPageIndex] = useState<number>(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_SIZE);

  const { data, trigger, pageCount, isLoading, isError, error, isEmpty } = useHousesPerformance();

  useEffect(() => {
    if (error) {
      toast.error('Невдалось завантажити таблицю огляду квартир');
    }
  }, [error]);

  const onLimitChange = (limit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(limit);
    trigger({
      pageIndex: DEFAULT_START_PAGE,
      pageSize: limit,
    });
  };

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

      if (next.pageSize !== limit) {
        const firstItemIndex = pageIndex * limit;
        const newPageIndex = Math.floor(firstItemIndex / next.pageSize);

        setPageIndex(newPageIndex);
        setLimit(next.pageSize);

        trigger({
          pageIndex: newPageIndex,
          pageSize: next.pageSize,
        });
      } else {
        setPageIndex(next.pageIndex);

        trigger({
          pageIndex: next.pageIndex,
          pageSize: limit,
        });
      }
    },

    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <HousesPerformanceTableSkeleton rows={limit} />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Огляд квартир</CardTitle>
          <CardDescription>Зведений огляд результатів роботи кожної квартири</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <HousesPerformanceTable table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
