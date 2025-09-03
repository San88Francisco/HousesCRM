import { ThemeValue } from '@/hooks/use-theme';
import { JSX } from 'react';

export type ThemeOptionType = {
  value: ThemeValue;
  label: string;
  icon: JSX.Element;
};
