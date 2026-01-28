import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { ContractWithRevenue } from '@/types/core/contract';
import { ContractStatus } from '@/types/core/status/status';
import { ColumnDef } from '@tanstack/react-table';

export const AllRentersContractsTableColumns: ColumnDef<ContractWithRevenue>[] = [
  {
    accessorKey: 'commencement',
    header: 'Початок',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    accessorKey: 'termination',
    header: 'Завершення',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    header: 'Тривалість',
    accessorFn: row => contractDuration(row.commencement, row.termination),
  },
  {
    accessorKey: 'monthlyPayment',
    header: 'Щомісячний платіж',
    cell: ctx => `${ctx.getValue<number>().toLocaleString()} ₴`,
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Загальний дохід',
    cell: ctx => (
      <span className="font-medium">{`${ctx.getValue<number>().toLocaleString()} ₴`}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => {
      const status = ctx.getValue<ContractStatus>();
      const isActive = status === ContractStatus.ACTIVE;

      return (
        <div
          className={cn(
            'font-medium text-center w-full ',
            isActive ? 'text-yellow' : 'text-purple',
          )}
        >
          {isActive ? 'Активний' : 'Неактивний'}
        </div>
      );
    },
  },
];
