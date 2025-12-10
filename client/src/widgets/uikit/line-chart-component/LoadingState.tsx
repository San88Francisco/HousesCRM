import { Card, CardContent } from '@/shared/ui/card';

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-[400px]">
        Завантаження аналітики...
      </CardContent>
    </Card>
  );
};
