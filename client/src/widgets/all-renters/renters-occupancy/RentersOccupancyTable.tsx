'use client';

import { TablePagination } from '@/components/table-pagination';
import { rentersOccupancyTablGrid } from '@/shared/constants/styles/renters-occupacy-table';
import { ROUTES } from '@/shared/routes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
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

  // TODO separate handleKeyDown to utils
  // const handleRowKeyDown = (renterID: string) => (e: KeyboardEvent<HTMLTableRowElement>) => {
  //   if (e.key === 'Enter' || e.key === ' ') {
  //     e.preventDefault();
  //     handleRouteToRenter(renterID);
  //   }
  // };

  return (
    <div className="flex flex-col justify-between h-full">
      <Table>
        <TableHeader>
          <TableRow className={cn(rentersOccupancyTablGrid)}>
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
                rentersOccupancyTablGrid,
                'cursor-pointer transition-colors duration-300 ease-out hover:bg-muted-foreground text-text',
              )}
              onClick={() => handleRouteToRenter(row.original.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRouteToRenter(row.original.id);
                }
              }}
              tabIndex={0}
              role="button"
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
