import { ContractModalTrigger } from '@/components/modals/contract-modal/ContractModalTrigger';
import { cn } from '@/shared/utils/cn';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { ColumnDef } from '@tanstack/react-table';

export const RentersOccupancyTableColumns: ColumnDef<RentersOccupancyItem>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => (
      <span onClick={e => e.stopPropagation()}>
        <ContractModalTrigger id={ctx.row.original.id} />
      </span>
    ),
  },
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    header: 'Орендар',
  },
  {
    accessorKey: 'occupied',
    header: 'Заселення',
    cell: ctx => new Date(ctx.getValue<string>()).toLocaleDateString('uk-UA'),
  },
  {
    accessorKey: 'vacated',
    header: 'Виселення',
    cell: ctx => new Date(ctx.getValue<string>()).toLocaleDateString('uk-UA'),
  },
  {
    id: 'duration',
    header: 'Тривалість',
    cell: ctx => contractDuration(ctx.row.original.occupied, ctx.row.original.vacated),
  },
  {
    accessorKey: 'totalIncome',
    header: 'Дохід',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()} ₴`,
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => (
      <span className={cn(ctx.getValue() === 'active' ? 'text-yellow' : 'text-purple')}>
        {ctx.getValue() === 'active' ? 'Активний' : 'Не активний'}
      </span>
    ),
  },
];
