/* eslint-disable */
'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';

import { PAGE_LIMIT } from '@/shared/constants/current-apartment';
import { RENTER_COLUMNS } from '@/shared/constants/current-renter';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { useGetAllContractsByRenterIdQuery } from '@/store/api/renters-api';
import { useParams } from 'next/navigation';

export const TableRenter = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetAllContractsByRenterIdQuery(
    {
      renterId: id,
      page: 1,
      limit: PAGE_LIMIT,
      sortBy: 'commencement',
      order: 'DESC',
    },
    {
      skip: !id,
    },
  );

  if (isLoading) return <LoadingState className="min-h-[550px]" />;
  if (error) return <ErrorState className="min-h-[550px]" error={error} />;

  const tableData = data?.allContractsByRenterId.data ?? [];

  if (!tableData.length) return <EmptyState className="min-h-[550px]" />;

  return (
    <div className="w-full min-w-0">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Всі контракти орендаря</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="w-full overflow-x-auto pb-6">
            <Table className="min-h-[550px] min-w-[800px]">
              <TableHeader>
                <TableRow style={{ gridTemplateColumns: '100px repeat(4, 1fr) 100px' }}>
                  {RENTER_COLUMNS.map((column, index) => {
                    const isFirstColumn = index === 0;
                    const isLastColumn = index === RENTER_COLUMNS.length - 1;
                    const shouldCenter = !isFirstColumn && !isLastColumn;

                    return (
                      <TableHead
                        key={index}
                        className={cn(shouldCenter && 'text-center', isLastColumn && 'text-right')}
                      >
                        {column}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {tableData.map((item: any) => {
                  return (
                    <TableRow
                      key={item.id}
                      style={{ gridTemplateColumns: '100px repeat(4, 1fr) 100px' }}
                      className="hover:bg-muted-foreground duration-300 cursor-pointer"
                    >
                      <TableCell className="text-center text-text">
                        {formatDate(item.commencement)}
                      </TableCell>
                      <TableCell className="text-center text-text">
                        {formatDate(item.termination)}
                      </TableCell>
                      <TableCell className="text-text text-center">
                        {' '}
                        {contractDuration(item.commencement, item.termination)}
                      </TableCell>
                      <TableCell className="text-text text-center">{item.monthlyPayment}</TableCell>
                      <TableCell className="text-text text-center">{item.totalRevenue}</TableCell>

                      <TableCell
                        className={cn(
                          'font-medium text-right w-full',
                          item.status === 'active' ? 'text-yellow' : 'text-purple',
                        )}
                      >
                        {item.status === 'active' ? 'Активний' : 'Неактивний'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
