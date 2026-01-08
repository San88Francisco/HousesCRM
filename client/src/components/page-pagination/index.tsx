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

export const PagePagination = ({ currentPage, totalPages, onPageChange, className }: Props) => {
  const currentPageIndex = currentPage - 1;

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const visiblePages = useVisiblePages(currentPageIndex, totalPages);
  const handlePageClick = (pageIndex: number) => {
    const pageNumber = pageIndex + 1;

    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };
  const handlePrevious = () => {
    if (canPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
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
            (() => {
              const pageNumber = page + 1;
              const isActive = currentPage === pageNumber;

              return (
                <PaginationItem
                  key={page}
                  className={cn(
                    'cursor-pointer text-text',
                    isActive && 'bg-gray dark:bg-gray rounded-[8px] text-white border-gray',
                  )}
                >
                  <PaginationLink onClick={() => handlePageClick(page)} isActive={isActive}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })()
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
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
