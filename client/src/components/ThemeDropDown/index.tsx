'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NextTheme } from '@/types/core/theme';
import { Button } from '../ui/button';
import { MoonIcon } from '../ui/moon';
import { SunIcon } from '../ui/sun';
import { SunMoonIcon } from '../ui/sunmoon';
import { ThemeOptionItem } from './ThemeOptionItem';
import { useAnimatedIcon } from '@/hooks';

const THEME_OPTIONS = [NextTheme.Light, NextTheme.Dark, NextTheme.System];

const themeIconMap = {
  [NextTheme.Light]: SunIcon,
  [NextTheme.Dark]: MoonIcon,
  [NextTheme.System]: SunMoonIcon,
};

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  const CurrentIcon = themeIconMap[theme as NextTheme] || SunMoonIcon;

  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(
    <CurrentIcon className="h-4 w-4" />,
  );

  if (!mounted) {
    return (
      <Button
        variant="icon"
        className="flex items-center justify-center w-10 h-10 rounded-md border bg-background opacity-50"
      >
        <SunMoonIcon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-10 h-10">
        <Button variant="icon" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {animatedIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-12">
        {THEME_OPTIONS.map(option => (
          <ThemeOptionItem
            key={option}
            icon={themeIconMap[option]}
            onClick={() => setTheme(option)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
