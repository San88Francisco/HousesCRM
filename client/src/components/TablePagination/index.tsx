import { Table } from '@tanstack/react-table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { cn } from '@/lib/utils';
import useVisiblePages from '@/hooks/useVisiblePages';

interface TablePaginationProps<T> {
  table: Table<T>;
}

const TablePagination = <T,>({ table }: TablePaginationProps<T>) => {
  const currentPageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const visiblePages = useVisiblePages(currentPageIndex, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={table.getCanPreviousPage() ? () => table.previousPage() : undefined}
            className={cn(
              !table.getCanPreviousPage()
                ? 'pointer-events-none text-muted'
                : 'cursor-pointer text-text',
            )}
          />
        </PaginationItem>

        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => table.setPageIndex(page)}
                isActive={currentPageIndex === page}
                className={cn(
                  'cursor-pointer',
                  currentPageIndex === page ? 'text-muted' : 'text-text',
                )}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={table.getCanNextPage() ? () => table.nextPage() : undefined}
            className={cn(
              !table.getCanNextPage()
                ? 'pointer-events-none text-muted'
                : 'cursor-pointer text-text',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
