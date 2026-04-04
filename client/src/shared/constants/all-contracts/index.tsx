import { ContractStatusLabel } from '@/components/contract-status-label';
import { formatDate } from '@/shared/utils/format';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { Contract } from '@/types/core/contract';
import { ContractDeleteButton } from '@/widgets/modals/contract-modal/ContractDeleteButton';
import { ContractEditButton } from '@/widgets/modals/contract-modal/ContractEditButton';
import { PdfContractTrigger } from '@/widgets/modals/pdf-contract-content-modal/PdfContractTrigger';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrencyOptions } from '../currency';

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
    cell: ctx => <ContractStatusLabel status={ctx.row.original.status} />,
  },
  {
    id: 'actions',
    header: 'Дії',
    cell: ctx => (
      <div className="flex items-center justify-center gap-0.5">
        <ContractEditButton contractId={ctx.row.original.id} />
        <ContractDeleteButton contractId={ctx.row.original.id} />
      </div>
    ),
  },
];
