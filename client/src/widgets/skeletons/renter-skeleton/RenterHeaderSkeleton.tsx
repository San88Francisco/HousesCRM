import { Skeleton } from '@/shared/ui/skeleton';

export const RenterHeaderSkeleton = () => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 sm:h-7 w-40 sm:w-52" />
        <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
        <Skeleton className="h-4 w-28 sm:w-32" />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1 bg-muted/40 py-1">
            <Skeleton className="h-4 w-14 sm:w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};
