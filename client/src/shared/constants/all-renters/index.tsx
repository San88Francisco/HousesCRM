import { ContractStatusLabel } from '@/components/contract-status-label';
import { formatDate } from '@/shared/utils/format';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { ContractModalTrigger } from '@/widgets/modals/contract-modal/ContractModalTrigger';
import { RenterDeleteButton } from '@/widgets/modals/renter-modal/RenterDeleteButton';
import { RenterEditButton } from '@/widgets/modals/renter-modal/RenterEditButton';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrencyOptions } from '../currency';

export const RentersOccupancyTableColumns: ColumnDef<RentersOccupancyItem>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => <ContractModalTrigger id={ctx.row.original.id} />,
  },
  {
    id: 'fullName',
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
    cell: ctx => (
      <span className="font-semibold">
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => <ContractStatusLabel status={ctx.row.original.status} />,
  },
  {
    accessorKey: 'contractsCount',
    header: 'Контрактів',
    cell: ctx => <span className="tabular-nums">{ctx.row.original.contractsCount ?? 0}</span>,
  },
  {
    id: 'actions',
    header: 'Дії',
    cell: ctx => (
      <div className="flex items-center justify-center gap-0.5">
        <RenterEditButton renter={ctx.row.original} />
        <RenterDeleteButton renterId={ctx.row.original.id} />
      </div>
    ),
  },
];
