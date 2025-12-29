import { Card, CardContent } from '@/shared/ui/card';
import { getErrorMessage } from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { cn } from '@/shared/utils/cn';

type Props = {
  className?: string;
  error: unknown;
};

export const ErrorState = ({ error, className }: Props) => {
  const errorMessage = getErrorMessage(error);

  return (
    <Card className={cn('mx-auto', className)}>
      <CardContent className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="mb-2 text-[var(--red)]">Помилка завантаження даних</p>
          <p className="text-sm text-[var(--muted-text)]">{errorMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
};
