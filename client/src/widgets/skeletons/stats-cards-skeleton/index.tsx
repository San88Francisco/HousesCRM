import { Card, CardContent, CardHeader, CardVariant } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const SKELETON_VARIANTS: CardVariant[] = ['yellow', 'purple', 'sky'];

const StatCardSkeleton = ({ variant }: { variant: CardVariant }) => (
  <Card variant={variant}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-3 w-24" />
      </div>
    </CardHeader>
    <CardContent variant={variant}>
      <Skeleton className="h-8 w-32 mb-1" />
      <Skeleton className="h-3 w-20" />
    </CardContent>
  </Card>
);

export const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {SKELETON_VARIANTS.map(v => (
      <StatCardSkeleton key={v} variant={v} />
    ))}
  </div>
);
