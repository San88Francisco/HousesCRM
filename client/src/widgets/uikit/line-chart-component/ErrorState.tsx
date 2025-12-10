import { Card, CardContent } from '@/shared/ui/card';

export const ErrorState = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-[400px] text-red-500">
        Помилка завантаження даних
      </CardContent>
    </Card>
  );
};
