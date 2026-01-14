'use client';

import { rentersTableGrid } from '@/shared/constants/styles';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { Contract } from '@/types/core/contract';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { HousesPerformanceSelect } from '../../houses-performance-analytic/HousesPerformanceSelect';

type Props<T> = {
  table: TableType<T>;
  limit: number;
  setLimit: (limit: number) => void;
};

export const TableRenter = ({ table, limit, setLimit }: Props<Contract>) => {
  if (!table) return null;
  return (
    <div className="flex flex-col justify-between h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className={cn(rentersTableGrid)}>
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

        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.original.id}
              className={cn(
                rentersTableGrid,
                'cursor-pointer transition-colors duration-300 ease-out hover:bg-muted-foreground text-text',
              )}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <div className="flex gap-3">
          <HousesPerformanceSelect limit={limit} setLimit={setLimit} />
          <TablePagination table={table} />
        </div>
      </div>
    </div>
  );
};
