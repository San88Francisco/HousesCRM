import { Sun, Moon, SunMoon } from 'lucide-react';

import { ThemeOptionType } from '@/types/core/themeOptiontype';

export const themeOptions: ThemeOptionType[] = [
  { label: 'Світла', icon: <Sun className="h-4 w-4" />, value: 'світла' },
  { label: 'Темна', icon: <Moon className="h-4 w-4" />, value: 'темна' },
  { label: 'Авто', icon: <SunMoon className="h-4 w-4" />, value: 'авто' },
];
