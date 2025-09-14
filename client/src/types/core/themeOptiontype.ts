import { JSX } from 'react';
import { ThemeValue } from './theme';

export type ThemeOptionType = {
  value: ThemeValue;
  label: string;
  icon: JSX.Element;
};
