import { formatCurrency } from '@/shared/utils/table/formatters';
import { HousePerformanceItem } from '@/types/core/houses-performance';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrencyOptions } from '../currency';

export const HousesPerformanceTableColumns: ColumnDef<HousePerformanceItem>[] = [
  {
    accessorKey: 'apartmentName',
    header: 'Квартира',
    cell: ctx => <span className="font-semibold">{ctx.getValue<string>()}</span>,
  },
  {
    accessorKey: 'rentersCount',
    header: 'Орендарі',
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Дохід',
    cell: ctx => (
      <span className="font-semibold">
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
    ),
  },
  {
    accessorKey: 'currentPayment',
    header: 'Поточний платіж',
    cell: ctx => (
      <span className="font-semibold">
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
    ),
  },
];
