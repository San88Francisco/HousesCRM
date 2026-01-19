'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';

import { useRentersContracts } from '@/hooks/renters/use-renters-contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { HousesPerformanceTableSkeleton } from '@/widgets/skeletons/houses-performance-table-skeleton';
import { useParams } from 'next/navigation';
import { TableRenter } from './TableRenter';

export const RentersReport = () => {
  const { id } = useParams<{ id: string }>();

  const { table, limit, setLimit, isLoading, isError, error, hasData } = useRentersContracts(id);

  if (isLoading) return <HousesPerformanceTableSkeleton />;

  if (isError) return <ErrorState className="w-full" error={error} />;

  if (!hasData) return <EmptyState className="w-full" />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Історія договорів орендаря</CardTitle>
      </CardHeader>

      <CardContent>
        <TableRenter table={table} limit={limit} setLimit={setLimit} />
      </CardContent>
    </Card>
  );
};
