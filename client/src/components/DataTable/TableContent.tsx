'use client';
import { ColumnDef, Table as TableType } from '@tanstack/react-table';
import { Table } from '@/components/ui/table';
import { TableFilters } from '@/components/TableFilters';
import TableBodyContent from './TableBodyContent';
import TableFooter from './TableFooter';
import TableHeaderContent from './TableHeaderContent';

const TableContent = <T,>({
  table,
  columns,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: {
  table: TableType<T>;
  columns: ColumnDef<T>[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
}) => (
  <>
    <TableFilters
      table={table}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
    />

    <div className="overflow-hidden">
      <Table>
        <TableHeaderContent table={table} />
        <TableBodyContent table={table} columns={columns} />
      </Table>
    </div>

    <TableFooter table={table} />
  </>
);

export default TableContent;
