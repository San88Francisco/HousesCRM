'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
  Table as TableType,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from '@/components/TablePagination';
import { TableFilters } from '@/components/TableFilters';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  searchColumn?: string;
};

const TableHeaderContent = <T,>({ table }: { table: TableType<T> }) => (
  <TableHeader>
    {table.getHeaderGroups().map(headerGroup => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
);

const EmptyTableBody = ({ columnsLength }: { columnsLength: number }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={columnsLength} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  </TableBody>
);

const TableBodyRows = <T,>({ table }: { table: TableType<T> }) => (
  <TableBody>
    {table.getRowModel().rows.map(row => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        variant="withData"
        className="group"
      >
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

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

// В хукі винести
const useDataTable = <T,>(data: T[], columns: ColumnDef<T>[]) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return table;
};

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

// В хукі винести
const useTableSearch = <T,>(table: TableType<T>, searchColumn: string) => {
  const searchValue = (table.getColumn(searchColumn)?.getFilterValue() as string) ?? '';

  const handleSearchChange = (value: string) => {
    table.getColumn(searchColumn)?.setFilterValue(value);
  };

  return { searchValue, handleSearchChange };
};

export const DataTable = <T,>({
  data,
  columns,
  title = 'Data List',
  searchPlaceholder = 'Search...',
  searchColumn = 'email',
}: Props<T>) => {
  const table = useDataTable(data, columns);
  const { searchValue, handleSearchChange } = useTableSearch(table, searchColumn);

  return (
    <div className="w-full mt-10">
      <h3 className="mb-4">{title}</h3>
      <TableContent
        table={table}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
      />
    </div>
  );
};
