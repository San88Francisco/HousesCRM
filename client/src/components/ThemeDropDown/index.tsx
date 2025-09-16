'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunMoon, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NextTheme } from '@/types/core/theme';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeIconMap = {
    [NextTheme.Light]: <Sun className="h-4 w-4" />,
    [NextTheme.Dark]: <Moon className="h-4 w-4" />,
    [NextTheme.System]: <SunMoon className="h-4 w-4" />,
  };

  const getThemeIcon = (themeValue: string) => {
    return themeIconMap[themeValue as NextTheme] || themeIconMap[NextTheme.System];
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
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          {getThemeIcon(theme || NextTheme.System)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-12">
        <DropdownMenuItem
          onClick={() => setTheme(NextTheme.Light)}
          className="flex items-center justify-center p-3"
        >
          {themeIconMap[NextTheme.Light]}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(NextTheme.Dark)}
          className="flex items-center justify-center p-3"
        >
          {themeIconMap[NextTheme.Dark]}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(NextTheme.System)}
          className="flex items-center justify-center p-3"
        >
          {themeIconMap[NextTheme.System]}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
