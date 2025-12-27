'use client';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Fragment } from 'react';
import { HousesPerformanceSelect } from './houses-performance-select';
import { cn } from '@/shared/utils/cn';
import { tableGrid } from '@/shared/constants/styles/houses-performance-table';

type Props<T> = {
  table: TableType<T>;
  limit: number;
  setLimit: (limit: number) => void;
};

export const HousesPerformanceTable = <T,>({ table, limit, setLimit }: Props<T>) => {
  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow className={cn(tableGrid)}>
            {table.getFlatHeaders().map(header => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} className={cn(tableGrid)}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 w-full flex justify-end">
        <div className="ml-auto flex gap-1">
          <HousesPerformanceSelect limit={limit} setLimit={setLimit} />
          <TablePagination table={table} />
        </div>
      </div>
    </Fragment>
  );
};
