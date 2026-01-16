'use client';

import { PagePagination } from '@/components/page-pagination';
import { cn } from '@/shared/utils/cn';
import { Table } from '@tanstack/react-table';
import { TablePaginationSelect } from './TablePaginationSelect';

type Props<T> = {
  table: Table<T>;
  limit: number;
  onLimitChange: (limit: number) => void;
  className?: string;
};

export const TablePagination = <T,>({ table, limit, onLimitChange, className }: Props<T>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  return (
    <div className={cn('flex gap-3', className)}>
      <TablePaginationSelect limit={limit} onLimitChange={onLimitChange} />
      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
