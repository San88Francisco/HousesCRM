import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';
import { getErrorMessage } from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';

export const LoadingState = () => {
  return (
    <Card className="max-w-[400px] mx-auto">
      <CardContent className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-current')} />
          <p className="text-[var(--muted-text)]">Завантаження...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ErrorState = ({ error }: { error: unknown }) => {
  const errorMessage = getErrorMessage(error);

  return (
    <Card className="max-w-[400px] mx-auto">
      <CardContent className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="mb-2 text-[var(--red)]">Помилка завантаження даних</p>
          <p className="text-sm text-[var(--muted-text)]">{errorMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmptyState = () => {
  return (
    <Card className="max-w-[400px] mx-auto">
      <CardContent className="flex items-center justify-center h-96">
        <p className="text-[var(--muted-text)]">Немає даних для відображення</p>
      </CardContent>
    </Card>
  );
};
