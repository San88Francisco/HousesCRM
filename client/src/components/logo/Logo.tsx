'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LOGOS } from '@/constants/logo/logos';
import { NextTheme } from '@/types/core/theme';

export const Logo = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-4 flex justify-center">
        <Image alt="logo" src={LOGOS.light} width={84} height={28} />
      </div>
    );
  }

  const logoSrc = resolvedTheme === NextTheme.Dark ? LOGOS.dark : LOGOS.light;


  return (
    <div className="p-4 flex justify-center">
      <Image alt="logo" src={logoSrc} width={84} height={28} />
    </div>
  );
};
