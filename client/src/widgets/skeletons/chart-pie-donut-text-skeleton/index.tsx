import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const ChartPieDonutTextSkeleton = () => {
  return (
    <Card className="w-full" aria-busy="true" aria-label="Завантаження...">
      <CardHeader className="items-center pb-0 mb-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-72" />
          <Skeleton className="h-4 w-64" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row gap-10 items-center justify-center">
        <div className="relative flex items-center justify-center w-[260px] h-[260px]">
          <Skeleton className="absolute w-full h-full rounded-full" />
          <div className="absolute w-[150px] h-[150px] bg-card rounded-full" />
        </div>

        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
