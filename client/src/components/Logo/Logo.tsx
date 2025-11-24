'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const LOGOS = {
  light: '/logo/lightLogo.png',
  dark: '/logo/darkLogo.png',
};

export const Logo = () => {
  const [mounted, setMounted1] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setMounted(true);
  }, []);
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

  return (
    <div className="p-4 flex justify-center">
      <Image
        alt="logo"
        src={resolvedTheme === 'dark' ? LOGOS.dark : LOGOS.light}
        width={84}
        height={28}
      />
    </div>
  );
};
