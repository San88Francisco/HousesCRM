import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Payment } from '@/types/services/payment';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusCell } from '../components/StatusCell';
import { TableActions } from '../components/TableActions';

interface UseTableColumnsProps {
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function useTableColumns({ onEdit, onDelete }: UseTableColumnsProps = {}) {
  return useMemo<ColumnDef<Payment>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          label="Order ID"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
          <span className="ml-2 font-medium text-text">{row.original.id}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusCell status={row.getValue('status')} />,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="capitalize">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <TableActions
          onEdit={() => onEdit?.(row.original)}
          onDelete={() => onDelete?.(row.original)}
        />
      ),
    },
  ], [onEdit, onDelete]);
}
