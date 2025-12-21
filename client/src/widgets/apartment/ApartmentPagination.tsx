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
import { metadataResponse } from '@/types/services/houses';
import useVisiblePages from '@/hooks/use-visible-pages';

type Props = {
  meta?: metadataResponse;
  onPageChange: (page: number) => void;
};

export const ApartmentPagination = ({ meta, onPageChange }: Props) => {
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const visiblePages = useVisiblePages(currentPage - 1, totalPages);

  return (
    <Pagination className="mt-5">
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
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page + 1)}
                isActive={currentPage === page + 1}
                className={cn('cursor-pointer text-text', currentPage === page + 1 && 'text-muted')}
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
