'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { AllContractsTableColumns } from '@/shared/constants/all-contracts';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useGetContractsQuery } from '@/store/api/contracts-api';
import { RentersOccupancyTableSkeleton } from '@/widgets/skeletons/renters-occupancy-table-skeleton';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { ContractsTable } from './ContractsTable';

export const AllContracts = () => {
  const [pageIndex, setPageIndex] = useState<number>(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_SIZE);

  const { data, isLoading, isError, error } = useGetContractsQuery({
    page: pageIndex + 1,
    limit,
  });
  const isEmpty = !data?.data.length;

  const onLimitChange = (newLimit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(newLimit);
  };

  const table = useReactTable({
    data: data?.data ?? [],
    columns: AllContractsTableColumns,

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
          <CardTitle>Всі Договори</CardTitle>
          <CardDescription>
            Хронологія орендних договорів та їх фінансових результатів.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ContractsTable table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
