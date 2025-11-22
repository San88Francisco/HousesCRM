'use client';

import { LOGOS } from '@/constants/logo/logos';
import { cn } from '@/shared/utils/cn';
import { NextTheme } from '@/types/core/theme';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function BackgroundLogo() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[80vw] max-w-[950px] aspect-square">
        <Image
          alt="background logo"
          src={resolvedTheme === NextTheme.Dark ? LOGOS.dark : LOGOS.light}
          fill
          className={cn(
            'object-contain select-none',
            resolvedTheme === NextTheme.Dark ? 'opacity-[0.2]' : 'opacity-[0.0.3]',
          )}
        />
      </div>
    </div>
  );
}
