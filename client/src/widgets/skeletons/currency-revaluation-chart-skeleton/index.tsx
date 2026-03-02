import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const CurrencyRevaluationChartSkeleton = () => {
  return (
    <Card className="w-full mx-auto" aria-busy="true" aria-label="Завантаження...">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-48" />
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-24 flex-shrink-0" />
              <Skeleton className="h-4 w-24 flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
