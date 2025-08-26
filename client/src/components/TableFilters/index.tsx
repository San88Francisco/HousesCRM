import React from 'react';
import { ArrowDownWideNarrow, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';

interface TableFiltersProps<T> {
  table: Table<T>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
}

export function TableFilters<T>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: TableFiltersProps<T>) {
  const emailColumn = table.getColumn('email');

  return (
    <div className="flex items-center justify-between p-2 bg-foreground rounded-lg">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon">
              <ArrowDownWideNarrow />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => emailColumn?.toggleSorting(emailColumn.getIsSorted() === 'asc')}
          variant="icon"
        >
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={event => onSearchChange(event.target.value)}
        icon={<Search />}
      />
    </div>
  );
}
