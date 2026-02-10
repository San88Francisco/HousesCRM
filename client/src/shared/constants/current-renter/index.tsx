import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { ContractWithRevenue } from '@/types/core/contract';
import { ContractStatus } from '@/types/core/status';
import { PdfContractTrigger } from '@/widgets/modals/pdf-contract-content-modal/PdfContractTrigger';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrencyOptions } from '../currency';

export const AllRentersContractsTableColumns: ColumnDef<ContractWithRevenue>[] = [
  {
    accessorKey: 'id',
    header: 'Договір',
    cell: ctx => <PdfContractTrigger id={ctx.getValue<string>()} />,
  },
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
    cell: ctx => formatCurrency(ctx.getValue<number>(), formatCurrencyOptions),
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Загальний дохід',
    cell: ctx => (
      <span className="font-medium">
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
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
