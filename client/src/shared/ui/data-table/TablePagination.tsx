import { PagePagination } from '@/components/page-pagination';
import { Table } from '@tanstack/react-table';

type Props<T> = {
  table: Table<T>;
  className?: string;
};

const TablePagination = <T,>({ table, className }: Props<T>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  return (
    <PagePagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      className={className}
    />
  );
};

export default TablePagination;
