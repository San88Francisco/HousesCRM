import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { ContractStatus } from '@/types/core/status/status';

import { ColumnDef } from '@tanstack/react-table';

import { Contract } from '@/types/core/contract';
import { PdfContractTrigger } from '@/widgets/modals/pdf-contract-content-modal/PdfContractTrigger';
import { formatCurrencyOptions } from '../currency/format-options';

export const AllContractsTableColumns: ColumnDef<Contract>[] = [
  {
    id: 'action',
    header: 'Договір',
    cell: ctx => <PdfContractTrigger id={ctx.row.original.id} />,
  },
  {
    accessorKey: 'commencement',
    header: 'Початок',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    accessorKey: 'termination',
    header: 'Закінчення',
    cell: ctx => formatDate(ctx.getValue<string>()),
  },
  {
    id: 'duration',
    header: 'Тривалість',
    cell: ctx => contractDuration(ctx.row.original.commencement, ctx.row.original.termination),
  },
  {
    accessorKey: 'monthlyPayment',
    header: 'Місячна плата',
    cell: ctx => (
      <span className="font-semibold">
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    cell: ctx => (
      <span
        className={cn(ctx.getValue() === ContractStatus.ACTIVE ? 'text-yellow' : 'text-purple')}
      >
        {ctx.getValue() === ContractStatus.ACTIVE ? 'Активний' : 'Не активний'}
      </span>
    ),
  },
];
