'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { RentersOccupancyTableColumns } from '@/shared/constants/all-renters/renters-occupancy';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
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

      setPageIndex(next.pageIndex);
    },

    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <RentersOccupancyTableSkeleton rows={limit} />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Всі Орендарі</CardTitle>
      </CardHeader>

      <CardContent>
        <RentersOccupancyTable table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
