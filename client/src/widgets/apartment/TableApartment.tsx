/* eslint-disable */
'use client';

import { EmptyState } from '@/components/chart-states/EmptyState';
import { ErrorState } from '@/components/chart-states/ErrorState';
import { LoadingState } from '@/components/chart-states/LoadingState';
import { ContractModalTrigger } from '@/components/modals/contract-modal/ContractModalTrigger';
import { apartmentColumns, PAGE_LIMIT } from '@/shared/constants/current-apartment';
import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { useGetHouseByIdOccupancyQuery, useGetHouseByIdQuery } from '@/store/houses-api';
import { occupancyApartmentResponse } from '@/types/services/houses';
import { ApartmentPagination } from '@/widgets/apartment/ApartmentPagination';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

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
    { id, page: currentPage!, limit: PAGE_LIMIT },
    { skip: !id || currentPage === null },
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isLoading = currentPage === null ? initialLoading : paginatedLoading;
  const error = currentPage === null ? initialError : paginatedError;

  if (isLoading) return <LoadingState className="min-h-[550px]" />;
  if (error) return <ErrorState className="min-h-[550px]" error={error} />;

  const occupancySource = currentPage === null ? initialData?.occupancyReports : paginatedData;

  const tableData: occupancyApartmentResponse[] = occupancySource?.data ?? [];
  const meta = occupancySource?.meta;

  if (!tableData.length) return <EmptyState className="min-h-[550px] w-full" />;

  const handleRouteToRenter = (renterId: string) => {
    push(`${ROUTES.RENTER}/${renterId}`);
  };

  return (
    <div className="w-full min-w-0">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Історія оренди</CardTitle>
        </CardHeader>

        <CardContent className=" p-0">
          <div className="w-full overflow-x-auto sm:px-6 px-3 pb-6">
            <Table className="min-h-[550px] min-w-[800px]">
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
                {tableData.map((item: occupancyApartmentResponse) => {
                  return (
                    <TableRow
                      key={item.id}
                      style={{ gridTemplateColumns: '60px repeat(4, 1fr) 100px' }}
                      className="hover:bg-muted-foreground duration-300 cursor-pointer "
                    >
                      <TableCell className="font-medium text-center  text-text">
                        <ContractModalTrigger id={item.id} />
                      </TableCell>
                      <TableCell className="font-medium text-center text-text">
                        <Button
                          variant="icon"
                          onClick={() => handleRouteToRenter(item.id)}
                          className="w-full text-center"
                        >
                          {item.firstName} {item.lastName}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-center text-text">
                        <Button
                          variant="icon"
                          onClick={() => handleRouteToRenter(item.id)}
                          className="w-full text-center font-normal"
                        >
                          {formatDate(item.occupied)}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-center text-text">
                        <Button
                          variant="icon"
                          onClick={() => handleRouteToRenter(item.id)}
                          className="w-full text-center font-normal"
                        >
                          {formatDate(item.vacated)}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-center text-text">
                        <Button
                          variant="icon"
                          onClick={() => handleRouteToRenter(item.id)}
                          className="w-full text-center"
                        >
                          {item.totalIncome} ₴
                        </Button>
                      </TableCell>
                      <TableCell tabIndex={0}>
                        <Button
                          variant="icon"
                          onClick={() => handleRouteToRenter(item.id)}
                          className={cn(
                            'font-medium text-right  w-full',
                            item.status !== 'active' && 'text-purple',
                            item.status === 'active' && 'text-yellow',
                          )}
                        >
                          {item.status === 'active' ? 'Активний' : 'Не активний'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {meta && <ApartmentPagination meta={meta} onPageChange={handlePageChange} />}
    </div>
  );
};
