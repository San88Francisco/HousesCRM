import { HousePerformanceItem } from '@/types/core/houses-performance/types';
import { ColumnDef } from '@tanstack/react-table';

export const HousesPerformanceTableColumns: ColumnDef<HousePerformanceItem>[] = [
  {
    accessorKey: 'apartmentName',
    header: 'Квартира',
  },
  {
    accessorKey: 'rentersCount',
    header: 'Орендарі',
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Дохід',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()}₴`,
  },
  {
    accessorKey: 'currentPayment',
    header: 'Поточний платіж',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()}₴`,
  },
];
