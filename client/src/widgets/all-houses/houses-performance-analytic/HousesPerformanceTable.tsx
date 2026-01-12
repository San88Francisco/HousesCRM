'use client';
import { tableGrid } from '@/shared/constants/styles/houses-performance-table';
import { ROUTES } from '@/shared/routes';
import TablePagination from '@/shared/ui/data-table/TablePagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { HousePerformanceItem } from '@/types/core/houses-performance';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { HousesPerformanceSelect } from './HousesPerformanceSelect';

type Props<T> = {
  table: TableType<T>;
  limit: number;
  setLimit: (limit: number) => void;
};

export const HousesPerformanceTable = ({ table, limit, setLimit }: Props<HousePerformanceItem>) => {
  const { push } = useRouter();

  const handleRouteToHouse = (houseId: string) => {
    push(`${ROUTES.HOUSE}/${houseId}`);
  };
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
            <TableRow
              key={row.original.id}
              className={cn(
                tableGrid,
                'cursor-pointer transition-colors duration-300 ease-out hover:bg-muted-foreground text-text',
              )}
              onClick={() => handleRouteToHouse(row.original.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRouteToHouse(row.original.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${row.original.apartmentName}`}
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
