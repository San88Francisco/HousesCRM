'use client';
import { tableGrid } from '@/shared/constants/styles/houses-performance-table';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { HousesPerformanceSelect } from './HousesPerformanceSelect';

type Props<T> = {
  table: TableType<T>;
  limit: number;
  setLimit: (limit: number) => void;
};

export const HousesPerformanceTable = <T,>({ table, limit, setLimit }: Props<T>) => {
  return (
    <div className="flex flex-col justify-between h-full">
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

      <div className="mt-4 flex justify-end">
        <div className="flex gap-3">
          <HousesPerformanceSelect limit={limit} setLimit={setLimit} />
          <TablePagination table={table} />
        </div>
      </div>
    </div>
  );
};
