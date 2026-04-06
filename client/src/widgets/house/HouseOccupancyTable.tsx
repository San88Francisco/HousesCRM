'use client';

import { TablePagination } from '@/components/table-pagination/TablePagination';
import { houseOccupancyTableGrid } from '@/shared/constants/styles/renters-occupancy-table';
import { ROUTES } from '@/shared/routes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { OccupancyWithVacancy } from '@/shared/utils/house/break-between-contracts';
import { createRowKeyDown } from '@/shared/utils/table/row-key-down-handler';
import { HouseOccupancyItem } from '@/types/model/houses-occupancy';
import { Table as TableType, flexRender } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

type Props = {
  table: TableType<OccupancyWithVacancy<HouseOccupancyItem>>;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export const HouseOccupancyTable = ({ table, limit, onLimitChange }: Props) => {
  const { push } = useRouter();

  const handleRouteToRenter = (renterId: string) => {
    push(`${ROUTES.RENTER}/${renterId}`);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={cn(houseOccupancyTableGrid)}>
              {table.getFlatHeaders().map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => {
              const isVacancy = row.original.isVacancy === true;

              return (
                <TableRow
                  key={row.original.id}
                  className={cn(
                    houseOccupancyTableGrid,
                    isVacancy
                      ? ''
                      : 'cursor-pointer transition-colors duration-300 ease-out hover:bg-muted-foreground text-text',
                  )}
                  onClick={isVacancy ? undefined : () => handleRouteToRenter(row.original.id)}
                  onKeyDown={
                    isVacancy
                      ? undefined
                      : createRowKeyDown(() => handleRouteToRenter(row.original.id))
                  }
                  tabIndex={isVacancy ? -1 : 0}
                  role={isVacancy ? undefined : 'button'}
                  aria-label={
                    isVacancy
                      ? undefined
                      : `View details for ${row.original.firstName} ${row.original.lastName}`
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <TablePagination table={table} limit={limit} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
};
