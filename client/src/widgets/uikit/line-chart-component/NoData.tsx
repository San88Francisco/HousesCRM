import { Card, CardContent } from '@/shared/ui/card';

export const NoData = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-[400px]">
        Немає даних для відображення
      </CardContent>
    </Card>
  );
};
