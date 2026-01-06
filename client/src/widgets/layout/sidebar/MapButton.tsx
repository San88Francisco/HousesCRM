'use client';

import { useSidebar } from '@/shared/ui/sidebar';
import { cn } from '@/shared/utils/cn';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export const MapButton = () => {
  const { theme } = useTheme();
  const { open } = useSidebar();
  return (
    <Link href="/geo-map-3d" className="block w-full">
      <div
        className={cn(
          'hover:opacity-85 duration-200  relative w-full  bg-no-repeat bg-cover bg-center bg-geo-map-3d rounded-lg flex items-center justify-center',
          open ? 'h-20' : 'h-10',
        )}
      >
        {open && (
          <span
            className={cn(
              'text-white font-semibold text-[16px] ',
              theme === 'dark' ? 'text-white' : 'text-black',
            )}
          >
            Карта
          </span>
        )}
      </div>
    </Link>
  );
};
