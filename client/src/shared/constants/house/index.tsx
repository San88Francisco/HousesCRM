import { ContractStatusLabel } from '@/components/contract-status-label';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format';
import { OccupancyWithVacancy } from '@/shared/utils/house/break-between-contracts';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';

import { ContractStatus } from '@/types/core/status';
import { HouseOccupancyItem } from '@/types/model/houses-occupancy';
import { ContractModalTrigger } from '@/widgets/modals/contract-modal/ContractModalTrigger';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrencyOptions } from '../currency';

export const HouseOccupancyTableColumns: ColumnDef<OccupancyWithVacancy<HouseOccupancyItem>>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;

      if (isVacancy) {
        return <div className="flex items-center justify-center text-red">—</div>;
      }

      return <ContractModalTrigger id={ctx.row.original.id} />;
    },
  },
  {
    id: 'fullName',
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    header: 'Орендар',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;
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
      const isVacancy = ctx.row.original.isVacancy;
      const value = ctx.getValue<string | null>();
      return <span className={cn(isVacancy && 'text-red')}>{value ? formatDate(value) : '—'}</span>;
    },
  },
  {
    accessorKey: 'vacated',
    header: 'Виселення',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;
      const value = ctx.getValue<string | null>();
      const status = ctx.row.original.status;

      if (isVacancy) {
        return <span className="text-red">{value ? formatDate(value) : '—'}</span>;
      }

      if (!value && status === ContractStatus.ACTIVE) {
        return <span className="text-text">Наразі орендує</span>;
      }

      return <span>{value ? formatDate(value) : '—'}</span>;
    },
  },
  {
    id: 'duration',
    header: 'Тривалість',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;
      const { occupied, vacated } = ctx.row.original;

      if (isVacancy) {
        return <span className="text-red">{contractDuration(occupied || '', vacated || '')}</span>;
      }

      if (occupied) {
        return <span>{contractDuration(occupied, vacated || '')}</span>;
      }

      return <span>—</span>;
    },
  },
  {
    accessorKey: 'totalIncome',
    header: 'Дохід',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;
      const value = ctx.getValue<number>();

      return (
        <span className={cn('font-semibold', isVacancy && 'text-red font-normal')}>
          {isVacancy ? '—' : formatCurrency(value, formatCurrencyOptions)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => {
      const isVacancy = ctx.row.original.isVacancy;

      if (isVacancy) {
        return <span className="text-red">—</span>;
      }

      return <ContractStatusLabel status={ctx.row.original.status} />;
    },
  },
];
