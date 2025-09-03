'use client';
import { DataTable } from '@/components/DataTable';
import { useTableColumns } from '@/hooks/useTableColumns';
import { Payment } from '@/types/services/payment';

type PaymentTableProps = {
  data: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
};

export const PaymentTable = ({ onEdit, onDelete, data }: PaymentTableProps) => {
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
