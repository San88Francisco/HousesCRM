import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

type Props = {
  className?: string;
};
export const EmptyState = ({ className }: Props) => {
  return (
    <Card className={cn('mx-auto', className)}>
      <CardContent className="flex items-center justify-center h-96">
        <p className="text-[var(--muted-text)]">Немає даних для відображення</p>
      </CardContent>
    </Card>
  );
};
