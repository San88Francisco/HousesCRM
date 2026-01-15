'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

import { PAGE_SIZE } from '@/shared/constants/table/pagination';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useGetAllContractsByRenterIdPaginatedQuery } from '@/store/api/renters-api';

import { AllRentersContractsTableColumns } from '@/shared/constants/current-renter';
import { HousesPerformanceTableSkeleton } from '@/widgets/skeletons/houses-performance-table-skeleton';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { TableRenter } from './TableRenter';

export const RentersReport = () => {
  const { id } = useParams<{ id: string }>();
  const [pageIndex, setPageIndex] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, isLoading, isError, error } = useGetAllContractsByRenterIdPaginatedQuery(
    {
      renterId: id,
      page: pageIndex + 1,
      limit: limit,
      sortBy: 'commencement',
      order: 'DESC',
    },
    {
      skip: !id,
    },
  );

  const table = useReactTable({
    data: data?.allContractsByRenterId.data ?? [],
    columns: AllRentersContractsTableColumns,

    manualPagination: true,
    pageCount: data?.allContractsByRenterId.meta?.totalPages ?? 1,
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

  if (isLoading) return <HousesPerformanceTableSkeleton />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (!data?.allContractsByRenterId.data.length) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Історія договорів орендаря</CardTitle>
      </CardHeader>

      <CardContent>
        <TableRenter table={table} limit={limit} setLimit={setLimit} />
      </CardContent>
    </Card>
  );
};
