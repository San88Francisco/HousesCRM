'use client';

import Image from 'next/image';
import { useTheme } from '@/hooks/use-theme';
import { useMounted } from '@/hooks/use-mounted';

const LOGOS = {
  light: '/logo/lightLogo.png',
  dark: '/logo/darkLogo.png',
} as const;

export const Logo = () => {
  const { isDarkMode } = useTheme();
  const mounted = useMounted();

  const logoSrc = mounted ? (isDarkMode ? LOGOS.dark : LOGOS.light) : LOGOS.light;

  return (
    <div className="p-4 flex justify-center">
      <Image alt="logo" src={logoSrc} width={84} height={28} />
    </div>
  );
};
