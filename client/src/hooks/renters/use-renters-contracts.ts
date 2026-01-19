import { AllRentersContractsTableColumns } from '@/shared/constants/current-renter';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/table/pagination';

import { getCoreRowModel, PaginationState, Updater, useReactTable } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useRenterContractsQuery } from './use-renter-contracts-query';

export const useRentersContracts = (renterId: string) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

  const { query, data, meta } = useRenterContractsQuery({ renterId, page: currentPage, limit });

  const handlePaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex, pageSize: limit }) : updater;

      setPageIndex(next.pageIndex);
      setCurrentPage(next.pageIndex ? next.pageIndex + 1 : null);
    },
    [pageIndex, limit],
  );

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPageIndex(0);
    setCurrentPage(null);
  }, []);

  const table = useReactTable({
    data,
    columns: AllRentersContractsTableColumns,
    manualPagination: true,
    pageCount: meta?.totalPages ?? 1,
    state: {
      pagination: {
        pageIndex,
        pageSize: limit,
      },
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    limit,
    setLimit: handleLimitChange,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasData: data.length > 0,
  };
};
