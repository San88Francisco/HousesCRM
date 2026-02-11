'use client';

import { TablePagination } from '@/components/table-pagination/TablePagination';
import { contractsTableGrid } from '@/shared/constants/styles/contracts-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Contract } from '@/types/core/contract';

import { flexRender, Table as TableType } from '@tanstack/react-table';

type Props = {
  table: TableType<Contract>;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export const ContractsTable = ({ table, limit, onLimitChange }: Props) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className={contractsTableGrid}>
              {table.getFlatHeaders().map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  <p className="text-muted-foreground">Немає договорів для відображення</p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.id} className={contractsTableGrid}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end">
        <TablePagination table={table} limit={limit} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
};
