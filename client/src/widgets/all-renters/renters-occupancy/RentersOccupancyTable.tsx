'use client';

import { TablePagination } from '@/components/table-pagination';
import { rentersOccupancyTableGrid } from '@/shared/constants/styles/renters-occupancy-table';
import { ROUTES } from '@/shared/routes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { createRowKeyDown } from '@/shared/utils/table/row-key-down-handler';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

type Props<T> = {
  table: TableType<T>;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export const RentersOccupancyTable = ({
  table,
  limit,
  onLimitChange,
}: Props<RentersOccupancyItem>) => {
  const { push } = useRouter();

  const handleRouteToRenter = (renterId: string) => {
    push(`${ROUTES.RENTER}/${renterId}`);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <Table>
        <TableHeader>
          <TableRow className={cn(rentersOccupancyTableGrid)}>
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
              key={row.original.id}
              className={cn(
                rentersOccupancyTableGrid,
                'cursor-pointer transition-colors duration-300 ease-out hover:bg-muted-foreground text-text',
              )}
              onClick={() => handleRouteToRenter(row.original.id)}
              onKeyDown={createRowKeyDown(() => handleRouteToRenter(row.original.id))}
              tabIndex={0}
              aria-label={`View details for ${row.original.firstName} ${row.original.lastName}`}
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
        <TablePagination table={table} limit={limit} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
};
