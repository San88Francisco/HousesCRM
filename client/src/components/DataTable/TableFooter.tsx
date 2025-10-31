'use client';
import { Table as TableType } from '@tanstack/react-table';
import TablePagination from '@/components/TablePagination';

const TableFooter = <T,>({ table }: { table: TableType<T> }) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
      row(s) selected.
    </div>
    <div className="space-x-2">
      <TablePagination table={table} />
    </div>
  </div>
);

export default TableFooter;
