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
import useVisiblePages from '@/hooks/use-visible-pages';

type TablePaginationProps<T> = {
  table: Table<T>;
};

const TablePagination = <T,>({ table }: TablePaginationProps<T>) => {
  const currentPageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const visiblePages = useVisiblePages(currentPageIndex, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            className={cn(
              'cursor-pointer text-text',
              !table.getCanPreviousPage() && 'pointer-events-none text-muted',
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
                  'cursor-pointer text-text',
                  currentPageIndex === page && 'text-muted',
                )}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            className={cn(
              'cursor-pointer text-text',
              !table.getCanNextPage() && 'pointer-events-none text-muted',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
