'use client';

import { LOGOS } from '@/constants/logo/logos';
import { cn } from '@/shared/utils/cn';
import { NextTheme } from '@/types/core/theme';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function BackgroundLogo() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[80vw] max-w-[950px] aspect-square" />
      </div>
    );
  }
  const logoSrc = resolvedTheme === NextTheme.Dark ? LOGOS.dark : LOGOS.light;
  const opacity = resolvedTheme === NextTheme.Dark ? 'opacity-[0.2]' : 'opacity-[0.3]';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[80vw] max-w-[950px] aspect-square">
        <Image
          alt="background logo"
          src={logoSrc}
          fill
          className={cn('object-contain select-none', opacity)}
        />
      </div>
    </div>
  );
}
