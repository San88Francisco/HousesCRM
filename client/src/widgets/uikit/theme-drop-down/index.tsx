'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunMoon, Moon, Sun } from 'lucide-react';
import { NextTheme } from '@/types/core/theme';
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';

const THEME_OPTIONS = [NextTheme.Light, NextTheme.Dark, NextTheme.System];

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeIconMap = {
    [NextTheme.Light]: Sun,
    [NextTheme.Dark]: Moon,
    [NextTheme.System]: SunMoon,
  };

  const getThemeIcon = (themeValue: string) => {
    const Icon = themeIconMap[themeValue as NextTheme] || themeIconMap[NextTheme.System];
    return <Icon className="h-4 w-4" />;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-md border bg-background opacity-50">
        <SunMoon className="h-4 w-4" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-10 h-10">
        <Button variant="outline">{getThemeIcon(theme || NextTheme.System)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-12">
        {THEME_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option}
            onClick={() => setTheme(option)}
            className="flex items-center justify-center p-3"
          >
            {(() => {
              const Icon = themeIconMap[option];
              return <Icon className="h-4 w-4" />;
            })()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
