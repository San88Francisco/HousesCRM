'use client';
import { useTableColumns } from '@/hooks/use-table-columns';
import { DataTable } from '@/shared/ui/data-table';
import { Payment } from '@/types/services/payment';

type Props = {
  data: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
};

export const PaymentTable = ({ onEdit, onDelete, data }: Props) => {
  const columns = useTableColumns({ onEdit, onDelete });

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Order List"
      searchPlaceholder="Search email..."
      searchColumn="email"
    />
  );
};
