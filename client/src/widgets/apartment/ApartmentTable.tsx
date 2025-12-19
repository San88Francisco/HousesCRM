import { CardTitle, Card, CardContent, CardHeader } from '@/shared/ui/card';
import { TableRow, Table, TableBody, TableCell, TableHead, TableHeader } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { occupanncyResponse } from '@/types/services/houses';
import { PdfContractTrigger } from '../pdf-contract-content/pdf-contract-trigger';

type Props = {
  tableColumns?: string[];
  dataTable?: occupanncyResponse[];
};

export const ApartmentTable = ({ tableColumns, dataTable }: Props) => {
  const tableData = dataTable || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Title</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns?.map((column, index) => {
                const isFirstColumn = index === 0;
                const isLastColumn = index === tableColumns.length - 1;
                const shouldCenter = !isFirstColumn && !isLastColumn;

                return isFirstColumn ? (
                  <TableHead key={index} className="w-[100px]">
                    {column}
                  </TableHead>
                ) : (
                  <TableHead key={index} className={cn(shouldCenter && 'text-center')}>
                    {column}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map(item => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.firstName} {item.lastName}
                  </TableCell>
                  <TableCell className="text-center">
                    <PdfContractTrigger id={item.id} />
                  </TableCell>
                  <TableCell className="text-center">{formatDate(item.occupied)}</TableCell>
                  <TableCell className="text-center">{formatDate(item.vacated)}</TableCell>
                  <TableCell className="text-center font-medium">{item.totalIncome} ₴</TableCell>
                  <TableCell
                    className={cn(
                      'font-medium',
                      item.status !== 'active' && 'text-purple',
                      item.status === 'active' && 'text-yellow',
                    )}
                  >
                    {item.status}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
