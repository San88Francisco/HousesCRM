import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { ContractStatus } from '@/types/core/status/status';
import { HouseOccupancyItem } from '@/types/model/houses-occupancy';
import { ContractModalTrigger } from '@/widgets/modals/contract-modal/ContractModalTrigger';
import { ColumnDef } from '@tanstack/react-table';

import { formatCurrencyOptions } from '../currency/format-options';

export const HouseOccupancyTableColumns: ColumnDef<HouseOccupancyItem>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');

      if (isVacancy) {
        return <div className="flex items-center justify-center text-red font-bold">-</div>;
      }

      return <ContractModalTrigger id={ctx.row.original.id} />;
    },
  },
  {
    id: 'fullName',
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    header: 'Орендар',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');
      return (
        <span className={cn('font-semibold', isVacancy && 'text-red font-normal')}>
          {ctx.getValue<string>()}
        </span>
      );
    },
  },
  {
    accessorKey: 'occupied',
    header: 'Заселення',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');
      return (
        <span className={cn(isVacancy && 'text-red')}>{formatDate(ctx.getValue<string>())}</span>
      );
    },
  },
  {
    accessorKey: 'vacated',
    header: 'Виселення',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');
      return (
        <span className={cn(isVacancy && 'text-red')}>{formatDate(ctx.getValue<string>())}</span>
      );
    },
  },
  {
    id: 'duration',
    header: 'Тривалість',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');
      return (
        <span className={cn(isVacancy && 'text-red')}>
          {contractDuration(ctx.row.original.occupied, ctx.row.original.vacated)}
        </span>
      );
    },
  },
  {
    accessorKey: 'totalIncome',
    header: 'Дохід',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');
      const value = ctx.getValue<number>();

      return (
        <span className={cn('font-semibold', isVacancy && 'text-red font-normal')}>
          {value === 0 ? '-' : formatCurrency(value, formatCurrencyOptions)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => {
      const isVacancy = ctx.row.original.id.startsWith('vacancy-');

      if (isVacancy) {
        return <span className="text-red mr-9">-</span>;
      }

      return (
        <span
          className={cn(ctx.getValue() === ContractStatus.ACTIVE ? 'text-yellow' : 'text-purple')}
        >
          {ctx.getValue() === ContractStatus.ACTIVE ? 'Активний' : 'Не активний'}
        </span>
      );
    },
  },
];
