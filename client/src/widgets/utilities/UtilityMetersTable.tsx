'use client';

import { TablePagination } from '@/components/table-pagination/TablePagination';
import { tableGridByMode } from '@/shared/constants/styles/meters-table';
import { getUtilityMode, UtilityConfig } from '@/shared/constants/utilities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { MeterReading } from '@/types/services/meters';
import { Table as TableType, flexRender } from '@tanstack/react-table';

type Props = {
  table: TableType<MeterReading>;
  config: UtilityConfig;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export const UtilityMetersTable = ({ table, config, limit, onLimitChange }: Props) => {
  const mode = getUtilityMode(config);
  const grid = tableGridByMode[mode];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full overflow-x-auto">
        <Table className={cn(mode === 'metered' ? 'min-w-[900px]' : 'min-w-[400px]')}>
          <TableHeader>
            <TableRow className={cn(grid)}>
              {table.getFlatHeaders().map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.original.id} className={cn(grid)}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <TablePagination table={table} limit={limit} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
};
