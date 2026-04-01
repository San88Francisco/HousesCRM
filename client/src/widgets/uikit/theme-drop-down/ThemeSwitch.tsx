'use client';
import { useAnimatedIcon, useThemeSwitcher } from '@/hooks';

import { THEME_OPTIONS, themeIconMap } from '@/shared/constants/theme';
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { SunMoonIcon } from '@/shared/ui/sunmoon';
import { ThemeOptionItem } from './ThemeOptionItem';

export const ThemeSwitch = () => {
  const { mounted, setSwitcherTheme, CurrentIcon } = useThemeSwitcher();

  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<CurrentIcon />);

  if (!mounted) {
    return (
      <Button
        variant="icon"
        className="flex items-center justify-center w-10 h-10 rounded-md border bg-background opacity-50"
      >
        <SunMoonIcon />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-10 h-10">
        <Button
          size="lg"
          variant="icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {animatedIcon}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-12">
        {THEME_OPTIONS.map(option => (
          <ThemeOptionItem
            key={option}
            icon={option in themeIconMap ? themeIconMap[option] : CurrentIcon}
            onClick={() => setSwitcherTheme(option)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
