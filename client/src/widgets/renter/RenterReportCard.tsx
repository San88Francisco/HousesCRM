'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

import { useRentersContracts } from '@/hooks/renters';
import { AllRentersContractsTableColumns } from '@/shared/constants/current-renter';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { HousesPerformanceTableSkeleton } from '@/widgets/skeletons/houses-performance-table-skeleton';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { TableRenter } from './TableRenter';

export const RenterReportCard = () => {
  const { id } = useParams<{ id: string }>();

  const [pageIndex, setPageIndex] = useState(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const { data, pageCount, trigger, isLoading, isError, error, isEmpty } = useRentersContracts(id);

  const onLimitChange = (nextLimit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(nextLimit);

    trigger({
      pageIndex: DEFAULT_START_PAGE,
      pageSize: nextLimit,
    });
  };

  const table = useReactTable({
    data: data ?? [],
    columns: AllRentersContractsTableColumns,

    manualPagination: true,
    pageCount,

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

  if (isLoading) return <HousesPerformanceTableSkeleton />;
  if (isError) return <ErrorState className="w-full" error={error} />;

  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Історія договорів орендаря</CardTitle>
      </CardHeader>

      <CardContent>
        <TableRenter table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
