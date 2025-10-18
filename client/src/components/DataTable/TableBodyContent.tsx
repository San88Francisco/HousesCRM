'use client';
import { ColumnDef, Table as TableType } from '@tanstack/react-table';
import TableBodyRows from './TableBodyRows';
import EmptyTableBody from './EmptyTableBody';

const TableBodyContent = <T,>({
  table,
  columns,
}: {
  table: TableType<T>;
  columns: ColumnDef<T>[];
}) => {
  const hasRows = table.getRowModel().rows?.length > 0;

  return hasRows ? (
    <TableBodyRows table={table} />
  ) : (
    <EmptyTableBody columnsLength={columns.length} />
  );
};

export default TableBodyContent;
