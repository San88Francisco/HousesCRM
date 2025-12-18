'use client';
import { mockData } from '@/shared/constants/table/dataTable';
import { PaymentTable } from '../uikit/payment-table';
import { useGetHouseByIdQuery } from '@/store/houses-api';
import { useParams } from 'next/navigation';

export const TableApartment = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetHouseByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Щось пішло не так</div>;
  return (
    <div>
      <PaymentTable data={mockData} />
    </div>
  );
};
