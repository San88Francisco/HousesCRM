import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const HouseRentalChartSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-3 w-full">
          <Skeleton className="h-6 sm:h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="h-10 w-44 rounded-md" />
      </CardHeader>

      <CardContent>
        <div className="w-full h-[330px] relative flex flex-col justify-between">
          <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full border-t border-muted/40" />
            ))}
          </div>

          <div className="absolute bottom-0 left-8 right-2 flex justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-10" />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
