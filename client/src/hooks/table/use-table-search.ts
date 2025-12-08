import { Table as TableType } from '@tanstack/react-table';

const useTableSearch = <T>(table: TableType<T>, searchColumn: string) => {
  const searchValue = (table.getColumn(searchColumn)?.getFilterValue() as string) ?? '';

  const handleSearchChange = (value: string) => {
    table.getColumn(searchColumn)?.setFilterValue(value);
  };

  return { searchValue, handleSearchChange };
};

export default useTableSearch;
