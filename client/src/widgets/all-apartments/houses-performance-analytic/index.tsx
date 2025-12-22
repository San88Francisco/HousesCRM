'use client';
import { useState } from 'react';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useGetHousesPerformanceQuery } from '@/store/houses-api';
import { HousePerformanceItem } from '@/types/core/houses-performance/types';
import { HousesPerformanceTable } from './houses-performance-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

const PAGE_SIZE = 1;

const columns: ColumnDef<HousePerformanceItem>[] = [
  {
    accessorKey: 'apartmentName',
    header: 'Квартира',
  },
  {
    accessorKey: 'rentersCount',
    header: 'Орендарі',
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Дохід',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()}₴`,
  },
  {
    accessorKey: 'currentPayment',
    header: 'Поточний платіж',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()}₴`,
  },
];

export const HousesPerformanceAnalytic = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const {
    data: response,
    isFetching,
    isError,
    error,
  } = useGetHousesPerformanceQuery({
    page: pageIndex + 1,
    limit: PAGE_SIZE,
    sortBy: 'totalRevenue',
    order: 'DESC',
  });

  const table = useReactTable({
    data: response?.data ?? [],
    columns,

    manualPagination: true,
    pageCount: response?.meta.totalPages ?? 0,

    state: {
      pagination: {
        pageIndex,
        pageSize: PAGE_SIZE,
      },
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex, pageSize: PAGE_SIZE }) : updater;

      setPageIndex(next.pageIndex);
    },

    getCoreRowModel: getCoreRowModel(),
  });

  if (isFetching) return <LoadingState className="w-full" />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (response?.data.length === 0) return <EmptyState className="w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Показники будинків</CardTitle>
      </CardHeader>

      <CardContent>
        <HousesPerformanceTable table={table} />
      </CardContent>
    </Card>
  );
};
