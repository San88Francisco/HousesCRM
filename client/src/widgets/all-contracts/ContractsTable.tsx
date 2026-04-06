'use client';

import { TablePagination } from '@/components/table-pagination/TablePagination';
import { ALL_CONTRACTS_TABLE } from '@/shared/constants/all-contracts/copy';
import {
  contractsTableClassName,
  contractsTableRootClassName,
  contractsTableScrollAreaClassName,
  contractsTableHeadCellClassName,
  contractsTableBodyCellClassName,
  contractsTableEmptyRowClassName,
  contractsTableEmptyTextClassName,
  contractsTablePaginationRowClassName,
} from '@/shared/constants/styles/contracts-table';
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
    <div className={contractsTableRootClassName}>
      <div className={contractsTableScrollAreaClassName}>
        <Table className={contractsTableClassName}>
          <TableHeader>
            <TableRow>
              {table.getFlatHeaders().map(header => (
                <TableHead key={header.id} className={contractsTableHeadCellClassName}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className={contractsTableEmptyRowClassName}
                >
                  <p className={contractsTableEmptyTextClassName}>
                    {ALL_CONTRACTS_TABLE.emptyMessage}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={contractsTableBodyCellClassName}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className={contractsTablePaginationRowClassName}>
        <TablePagination table={table} limit={limit} onLimitChange={onLimitChange} />
      </div>
    </div>
  );
};
