'use client';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '../table';

const TableHeaderContent = <T,>({ table }: { table: TableType<T> }) => (
  <TableHeader>
    {table.getHeaderGroups().map(headerGroup => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
);

export default TableHeaderContent;
