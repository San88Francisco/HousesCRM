import { ThemeValue } from '@/hooks/useTheme';
import { JSX } from 'react';

export type ThemeOptionType = {
  value: ThemeValue;
  label: string;
  icon: JSX.Element;
};
