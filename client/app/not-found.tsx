import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-muted">404</h1>
        <h2 className="text-2xl font-semibold">Сторінку не знайдено</h2>
        <p className="text-muted max-w-md">
          На жаль, сторінка яку ви шукаєте не існує або була видалена.
        </p>
      </div>
      <Link href={ROUTES.ALL_HOUSES}>
        <Button variant="default" className="gap-2">
          <Home className="w-4 h-4" />
          На головну
        </Button>
      </Link>
    </div>
  );
}
