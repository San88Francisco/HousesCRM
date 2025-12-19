'use client';

import { useGetHouseByIdQuery } from '@/store/houses-api';
import { useParams } from 'next/navigation';

import { LoadingState } from '@/components/chart-states/LoadingState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ApartmentTable } from './ApartmentTable';

export const TableApartment = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetHouseByIdQuery(id, {
    skip: !id,
  });

  const apartementColunns = [
    'Орендар',
    'Договір',
    'Початок контракту',
    'Кінець контракту',
    'Загальний дохід',
    'Статус',
  ];

  const firstData = data?.occupancyReports.slice(0, 5) || [];

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  return (
    <div>
      <ApartmentTable tableColumns={apartementColunns} dataTable={firstData} />
    </div>
  );
};
