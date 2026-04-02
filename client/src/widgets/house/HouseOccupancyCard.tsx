'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { useToastOnError } from '@/hooks';
import { useHouseOccupancy } from '@/hooks/house/house-occupancy';
import { HouseOccupancyTableColumns } from '@/shared/constants/house';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table';
import { breakBetweenContracts } from '@/shared/utils/house/break-between-contracts';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { HouseOccupancyTableSkeleton } from '../skeletons/house-occupancy/HouseOccupancyTableSkeleton';
import { HouseOccupancyTable } from './HouseOccupancyTable';

export const HouseOccupancyCard = () => {
  const { id } = useParams<{ id: string }>();

  const [pageIndex, setPageIndex] = useState(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const { data, pageCount, trigger, isLoading, isError, error, isEmpty } = useHouseOccupancy(id);

  useToastOnError(isError, 'Не вдалось завантажити таблицю історії оренди', 'HouseOccupancyCard');

  const onLimitChange = (nextLimit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(nextLimit);

    trigger({
      pageIndex: DEFAULT_START_PAGE,
      pageSize: nextLimit,
    });
  };

  const dataWithBreaks = breakBetweenContracts(data);

  const table = useReactTable({
    data: dataWithBreaks,
    columns: HouseOccupancyTableColumns,

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

  if (isLoading) return <HouseOccupancyTableSkeleton rows={limit} />;
  if (isError) return <ErrorState className="w-full" error={error} />;
  if (isEmpty) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Історія оренди</CardTitle>
          <CardDescription>
            Хронологія орендних контрактів та їх фінансових результатів.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <HouseOccupancyTable table={table} limit={limit} onLimitChange={onLimitChange} />
      </CardContent>
    </Card>
  );
};
