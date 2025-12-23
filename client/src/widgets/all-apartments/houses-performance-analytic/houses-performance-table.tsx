'use client';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Fragment } from 'react';
import { HousesPerformanceSelect } from './houses-performance-select';

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
          <TableRow
            className="
              grid grid-cols-4
              [&>*]:flex [&>*]:items-center
              [&>*:first-child]:justify-start
              [&>*:not(:first-child):not(:last-child)]:justify-center
              [&>*:last-child]:justify-end
            "
          >
            {table.getFlatHeaders().map(header => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              className="
                grid grid-cols-4
                [&>*]:flex [&>*]:items-center
                [&>*:first-child]:justify-start
                [&>*:not(:first-child):not(:last-child)]:justify-center
                [&>*:last-child]:justify-end
              "
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

      <div className="mt-4 w-full flex justify-end">
        <div className="ml-auto flex">
          <HousesPerformanceSelect limit={limit} setLimit={setLimit} />
          <TablePagination table={table} />
        </div>
      </div>
    </Fragment>
  );
};
