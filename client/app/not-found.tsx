import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

import { BackgroundLogo } from '@/shared/ui/background-logo';

const NotFound = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      <BackgroundLogo />
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted">404</h1>
          <h2 className="text-2xl font-semibold">Сторінку не знайдено</h2>
          <p className="text-muted max-w-md">
            На жаль, сторінка яку ви шукаєте не існує або була видалена.
          </p>
        </div>

        <Button variant="default" asChild>
          <Link className="flex items-center gap-2" href={ROUTES.ALL_HOUSES}>
            <Home className="w-4 h-4" aria-hidden="true" />
            На головну
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
