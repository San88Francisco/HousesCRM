import { DialogTitle } from '@/shared/ui/dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { PdfContractSkeletonSection } from './PdfContractSkeletonSection';

export const PdfContractSkeleton = () => {
  return (
    <div className="text-text">
      <DialogTitle>
        <Skeleton className="h-4 mb-2 w-full" />
      </DialogTitle>

      <div className="flex flex-col items-center mb-6 space-y-2">
        <Skeleton className="h-4 w-20 self-start rounded-md" />
      </div>

      <div className="space-y-2 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      {Array.from({ length: 6 }).map((_, i) => (
        <PdfContractSkeletonSection key={i} />
      ))}
    </div>
  );
};
