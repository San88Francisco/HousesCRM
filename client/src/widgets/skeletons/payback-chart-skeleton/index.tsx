import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const PaybackChartSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="w-full overflow-hidden">
          <div className="relative w-full md:h-[380px] flex flex-col justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[1px] opacity-40 bg-muted" />
            ))}

            <div className="absolute inset-0 flex items-end gap-1 px-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className={`w-10 rounded-md bg-muted/70`} />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>

          <div className="mt-8 w-full flex items-center">
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
