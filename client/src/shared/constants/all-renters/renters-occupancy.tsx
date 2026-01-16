import { ContractModalTrigger } from '@/components/modals/contract-modal/ContractModalTrigger';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { ColumnDef } from '@tanstack/react-table';

export const RentersOccupancyTableColumns: ColumnDef<RentersOccupancyItem>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => <ContractModalTrigger id={ctx.row.original.id} />,
  },
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    header: 'Орендар',
    cell: ctx => <span className="font-semibold">{ctx.getValue<string>()}</span>,
  },
  {
    accessorKey: 'occupied',
    header: 'Заселення',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    accessorKey: 'vacated',
    header: 'Виселення',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    id: 'duration',
    header: 'Тривалість',
    cell: ctx => contractDuration(ctx.row.original.occupied, ctx.row.original.vacated),
  },
  {
    accessorKey: 'totalIncome',
    header: 'Дохід',
    cell: ctx => <span className="font-semibold">{ctx.getValue<number>().toLocaleString()} ₴</span>,
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
