import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

type Props = {
  className?: string;
  message?: string;
};
export const EmptyState = ({ className, message }: Props) => {
  return (
    <Card className={cn('mx-auto w-full', className)}>
      <CardContent className="flex items-center justify-center h-96">
        <p className="text-muted">{message || 'Немає даних для відображення'}</p>
      </CardContent>
    </Card>
  );
};
