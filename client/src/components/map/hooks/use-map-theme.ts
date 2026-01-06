import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useMapTheme = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  return { isDark, mounted };
};

