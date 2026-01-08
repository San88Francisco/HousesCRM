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

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const visiblePages = useVisiblePages(currentPageIndex, totalPages);

  const handlePageClick = (pageIndex: number) => {
    const nextPage = pageIndex + 1;

    if (nextPage !== currentPage) {
      onPageChange(nextPage);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
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
              !canGoPrev && 'pointer-events-none text-muted',
            )}
          />
        </PaginationItem>
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNumber = page + 1;
          const isActive = pageNumber === currentPage;

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
        })}
        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={cn(
              'cursor-pointer text-text',
              !canGoNext && 'pointer-events-none text-muted',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
