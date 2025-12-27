import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

export const renderLoadingState = () => (
  <Card className="w-full">
    <CardContent className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-current')} />
        <p style={{ color: 'var(--muted-text)' }}>Завантаження...</p>
      </div>
    </CardContent>
  </Card>
);

export const renderErrorState = (errorMessage: string) => (
  <Card className="w-full">
    <CardContent className="flex items-center justify-center h-96">
      <div className="text-center">
        <p className="mb-2" style={{ color: 'var(--red)' }}>
          Помилка завантаження даних
        </p>
        <p className="text-sm" style={{ color: 'var(--muted-text)' }}>
          {errorMessage}
        </p>
      </div>
    </CardContent>
  </Card>
);

export const renderEmptyState = () => (
  <Card className="w-full">
    <CardContent className="flex items-center justify-center h-96">
      <p style={{ color: 'var(--muted-text)' }}>Немає даних для відображення</p>
    </CardContent>
  </Card>
);
