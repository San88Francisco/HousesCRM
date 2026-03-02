import { rentersOccupancyTableGrid } from '@/shared/constants/styles/renters-occupancy-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { cn } from '@/shared/utils/cn';

type Props = {
  rows?: number;
};

export const RentersOccupancyTableSkeleton = ({ rows = 10 }: Props) => {
  return (
    <Card className="w-full" aria-busy="true" aria-label="Завантаження...">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>
            <Skeleton className="h-5 w-56" />
          </CardTitle>
          <Skeleton className="h-4 w-[600px]" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className={cn(rentersOccupancyTableGrid)}>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-40" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-40" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead className="justify-end">
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index} className={rentersOccupancyTableGrid}>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-6" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="justify-end">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 w-full flex justify-end gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
};
