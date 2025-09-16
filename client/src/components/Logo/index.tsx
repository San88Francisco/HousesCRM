'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const LOGOS = {
  light: '/logo/lightLogo.png',
  dark: '/logo/darkLogo.png',
} as const;

export const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  const logoSrc = resolvedTheme === 'dark' ? LOGOS.dark : LOGOS.light;

  return (
    <div className="p-4 flex justify-center">
      <Image alt="logo" src={logoSrc} width={84} height={28} />
    </div>
  );
};
