'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

import { useToastOnError } from '@/hooks';
import { RentersOccupancyTableColumns } from '@/shared/constants/all-renters';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useGetRentersQuery } from '@/store/api/renters-api';
import { RentersOccupancyTableSkeleton } from '@/widgets/skeletons/renters-occupancy-table-skeleton';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { RentersOccupancyTable } from './RentersOccupancyTable';

export const RentersOccupancy = () => {
  const [pageIndex, setPageIndex] = useState<number>(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError, error } = useGetRentersQuery({
    page: pageIndex + 1,
    limit,
  });
  const isEmpty = !data?.data.length;

  const onLimitChange = (limit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(limit);
  };

  useToastOnError(isError, 'Не вдалось завантажити таблицю всіх орендарів', 'RentersOccupancy');

  const table = useReactTable({
    data: data?.data ?? [],
    columns: RentersOccupancyTableColumns,

    manualPagination: true,
    pageCount: data?.meta?.totalPages ?? 1,

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
      } else {
        setPageIndex(next.pageIndex);
      }
    },

    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <RentersOccupancyTableSkeleton rows={limit} />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Всі Орендарі</CardTitle>
          <CardDescription>
            Хронологія орендних контрактів та їх фінансових результатів.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <RentersOccupancyTable table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
