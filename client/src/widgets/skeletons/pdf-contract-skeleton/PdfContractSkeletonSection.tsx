import { Skeleton } from '@/shared/ui/skeleton';

export const PdfContractSkeletonSection = () => {
  return (
    <div className="mb-8">
      <Skeleton className="h-5 w-48 mb-3 rounded-md" />
      <div className="pl-3 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
};
