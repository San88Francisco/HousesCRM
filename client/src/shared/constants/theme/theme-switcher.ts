import { MoonIcon } from '@/shared/ui/moon';
import { SunIcon } from '@/shared/ui/sun';
import { SunMoonIcon } from '@/shared/ui/sunmoon';
import { NextTheme } from '@/types/core/theme/indexe';

export const THEME_OPTIONS = [NextTheme.Light, NextTheme.Dark, NextTheme.System];

export const themeIconMap = {
  [NextTheme.Light]: SunIcon,
  [NextTheme.Dark]: MoonIcon,
  [NextTheme.System]: SunMoonIcon,
};
