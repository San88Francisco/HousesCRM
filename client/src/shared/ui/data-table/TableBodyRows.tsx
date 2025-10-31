'use client';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '../table';

const TableBodyRows = <T,>({ table }: { table: TableType<T> }) => (
  <TableBody>
    {table.getRowModel().rows.map(row => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        variant="withData"
        className="group"
      >
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

export default TableBodyRows;
