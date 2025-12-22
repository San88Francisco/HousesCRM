'use client';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Fragment } from 'react';

type Props<T> = {
  table: TableType<T>;
};

// стили на уровень выше гриды
// сделать фетч из кеша
// вынести константы

export const HousesPerformanceTable = <T,>({ table }: Props<T>) => {
  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            {table.getFlatHeaders().map(header => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
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
        <div className="ml-auto">
          <TablePagination table={table} />
        </div>
      </div>
    </Fragment>
  );
};
