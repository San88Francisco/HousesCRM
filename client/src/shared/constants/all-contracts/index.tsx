import { ContractStatusLabel } from '@/components/contract-status-label';
import { ALL_CONTRACTS_TABLE } from '@/shared/constants/all-contracts/copy';
import {
  contractsTableActionGroupClassName,
  contractsTableAmountClassName,
  emptyCellMutedClassName,
} from '@/shared/constants/styles/contracts-table';
import { EMPTY_DISPLAY } from '@/shared/constants/ui/empty-display';
import { formatFullName } from '@/shared/utils/display/format-full-name';
import { formatHouseLine } from '@/shared/utils/display/format-house-line';
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
    header: ALL_CONTRACTS_TABLE.columnContract,
    cell: ctx => <PdfContractTrigger id={ctx.row.original.id} />,
  },
  {
    id: 'renter',
    header: ALL_CONTRACTS_TABLE.columnRenter,
    cell: ctx => {
      const r = ctx.row.original.renter;
      if (!r) return <span className={emptyCellMutedClassName}>{EMPTY_DISPLAY}</span>;
      return formatFullName(r.firstName, r.lastName);
    },
  },
  {
    id: 'house',
    header: ALL_CONTRACTS_TABLE.columnHouse,
    cell: ctx => {
      const h = ctx.row.original.house;
      if (!h) return <span className={emptyCellMutedClassName}>{EMPTY_DISPLAY}</span>;
      return formatHouseLine(h);
    },
  },
  {
    accessorKey: 'commencement',
    header: ALL_CONTRACTS_TABLE.columnStart,
    cell: ctx => formatDate(ctx.getValue<string | null>()),
  },
  {
    accessorKey: 'termination',
    header: ALL_CONTRACTS_TABLE.columnEnd,
    cell: ctx => formatDate(ctx.getValue<string | null>()),
  },
  {
    id: 'duration',
    header: ALL_CONTRACTS_TABLE.columnDuration,
    cell: ctx => contractDuration(ctx.row.original.commencement, ctx.row.original.termination),
  },
  {
    accessorKey: 'monthlyPayment',
    header: ALL_CONTRACTS_TABLE.columnMonthly,
    cell: ctx => (
      <span className={contractsTableAmountClassName}>
        {formatCurrency(ctx.getValue<number>(), formatCurrencyOptions)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ALL_CONTRACTS_TABLE.columnStatus,
    cell: ctx => <ContractStatusLabel status={ctx.row.original.status} />,
  },
  {
    id: 'actions',
    header: ALL_CONTRACTS_TABLE.columnActions,
    cell: ctx => (
      <div className={contractsTableActionGroupClassName}>
        <ContractEditButton contractId={ctx.row.original.id} />
        <ContractDeleteButton contractId={ctx.row.original.id} />
      </div>
    ),
  },
];
