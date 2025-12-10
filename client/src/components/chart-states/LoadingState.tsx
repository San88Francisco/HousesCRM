import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

type Props = {
  className?: string;
};

export const LoadingState = ({ className }: Props) => {
  return (
    <Card className={cn('mx-auto', className)}>
      <CardContent className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-current')} />
          <p className="text-[var(--muted-text)]">Завантаження...</p>
        </div>
      </CardContent>
    </Card>
  );
};
