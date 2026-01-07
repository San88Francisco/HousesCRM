import useVisiblePages from '@/hooks/use-visible-pages';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { cn } from '@/shared/utils/cn';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const UniversalPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Props) => {
  const currentPageIndex = currentPage - 1;
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const visiblePages = useVisiblePages(currentPageIndex, totalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => canPreviousPage && onPageChange(currentPage - 1)}
            className={cn(
              'cursor-pointer text-text',
              !canPreviousPage && 'pointer-events-none text-muted',
            )}
          />
        </PaginationItem>

        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={page}
              className={cn(
                'cursor-pointer text-text',
                currentPageIndex === page &&
                  'bg-gray dark:bg-gray rounded-[8px] text-white border-gray',
              )}
            >
              <PaginationLink
                onClick={() => {
                  if (currentPageIndex !== page) {
                    onPageChange(page + 1);
                  }
                }}
                isActive={currentPageIndex === page}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => canNextPage && onPageChange(currentPage + 1)}
            className={cn(
              'cursor-pointer text-text',
              !canNextPage && 'pointer-events-none text-muted',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
