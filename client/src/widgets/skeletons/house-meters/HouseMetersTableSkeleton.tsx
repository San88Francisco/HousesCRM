import { metersTableGrid } from '@/shared/constants/styles/meters-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';

type Props = {
  rows?: number;
};

const COLUMNS_COUNT = 7;

export const HouseMetersTableSkeleton = ({ rows = 5 }: Props) => {
  return (
    <Card className="w-full" aria-busy="true" aria-label="Завантаження...">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>
            <Skeleton className="h-5 w-56" />
          </CardTitle>
          <Skeleton className="h-4 w-[400px] max-w-full" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className={cn(metersTableGrid)}>
                {Array.from({ length: COLUMNS_COUNT }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className={cn(metersTableGrid)}>
                  {Array.from({ length: COLUMNS_COUNT }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
