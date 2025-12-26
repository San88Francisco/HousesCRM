/* eslint-disable */
'use client';
import { useState } from 'react';
import { useGetHouseByIdQuery, useGetHouseByIdOccupancyQuery } from '@/store/houses-api';
import { useParams, useRouter } from 'next/navigation';
import { CardTitle, Card, CardContent, CardHeader } from '@/shared/ui/card';
import { TableRow, Table, TableBody, TableCell, TableHead, TableHeader } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { EmptyState } from '@/components/chart-states/EmptyState';
import { ApartmentPagination } from './ApartmentPagination';
import { OccupancyPaginatedResponse, occupanncyApartmentResponse } from '@/types/services/houses';
import { apartmentColumns } from '@/shared/constants/current-apartment';
import { ContractModalTrigger } from '@/components/modals/contract-modal/ContractModalTrigger';
import { ROUTES } from '@/shared/routes';

export const TableApartment = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const { push } = useRouter();

  const {
    data: initialData,
    isLoading: initialLoading,
    error: initialError,
  } = useGetHouseByIdQuery(id, {
    skip: !id || currentPage !== null,
  });

  const {
    data: paginatedData,
    isLoading: paginatedLoading,
    error: paginatedError,
  } = useGetHouseByIdOccupancyQuery(
    { id, page: currentPage!, limit: 10 },
    { skip: !id || currentPage === null },
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = currentPage === null ? initialLoading : paginatedLoading;
  const error = currentPage === null ? initialError : paginatedError;

  if (isLoading) return <LoadingState className="min-h-[550px]" />;
  if (error) return <ErrorState className="min-h-[550px]" error={error} />;

  const tableData: occupanncyApartmentResponse[] =
    currentPage === null
      ? initialData?.occupancyReports?.data || []
      : (paginatedData as OccupancyPaginatedResponse)?.data || [];

  const meta =
    currentPage === null
      ? initialData?.occupancyReports?.meta
      : (paginatedData as OccupancyPaginatedResponse)?.meta;

  if (!tableData.length) return <EmptyState className="min-h-[550px] w-full" />;

  const handleRouteToRenter = (id: string) => {
    push(`${ROUTES.RENTER}/${id}`);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Table Title</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[550px]">
          <Table>
            <TableHeader>
              <TableRow style={{ gridTemplateColumns: '60px repeat(4, 1fr) 100px' }}>
                {apartmentColumns.map((column, index) => {
                  const isFirstColumn = index === 0;
                  const isLastColumn = index === apartmentColumns.length - 1;
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
              {tableData.map((item: occupanncyApartmentResponse) => {
                return (
                  <TableRow
                    key={item.id}
                    style={{ gridTemplateColumns: '60px repeat(4, 1fr) 100px' }}
                    className="hover:bg-muted-foreground duration-300 cursor-pointer "
                  >
                    <TableCell className="font-medium text-center  text-text">
                      <ContractModalTrigger id={item.id} />
                    </TableCell>
                    <TableCell
                      onClick={() => handleRouteToRenter(item.id)}
                      className="font-medium text-center text-text"
                    >
                      {item.firstName} {item.lastName}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRouteToRenter(item.id)}
                      className="text-center text-text"
                    >
                      {formatDate(item.occupied)}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRouteToRenter(item.id)}
                      className="text-center text-text"
                    >
                      {formatDate(item.vacated)}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRouteToRenter(item.id)}
                      className="text-center font-medium text-text"
                    >
                      {item.totalIncome} ₴
                    </TableCell>
                    <TableCell
                      onClick={() => handleRouteToRenter(item.id)}
                      className={cn(
                        'font-medium text-right',
                        item.status !== 'active' && 'text-purple',
                        item.status === 'active' && 'text-yellow',
                      )}
                    >
                      {item.status === 'active' ? 'Активний' : 'Не активний'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {meta && <ApartmentPagination meta={meta} onPageChange={handlePageChange} />}
    </div>
  );
};
