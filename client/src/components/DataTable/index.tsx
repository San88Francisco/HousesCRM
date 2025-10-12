'use client';
import { ColumnDef } from '@tanstack/react-table';
import useTableSearch from '@/hooks/use-table-search';
import useDataTable from '@/hooks/use-data-table';
import TableContent from './TableContent';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  searchColumn?: string;
};

export const DataTable = <T,>({
  data,
  columns,
  title = 'Data List',
  searchPlaceholder = 'Search...',
  searchColumn = 'email',
}: Props<T>) => {
  const table = useDataTable(data, columns);
  const { searchValue, handleSearchChange } = useTableSearch(table, searchColumn);

  return (
    <div className="w-full mt-10">
      <h3 className="mb-4">{title}</h3>
      <TableContent
        table={table}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
      />
    </div>
  );
};
