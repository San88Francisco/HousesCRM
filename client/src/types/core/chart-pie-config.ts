import { THEMES } from '@/shared/constants/pie-chart/chartThemes';
import { ComponentType, ReactNode } from 'react';

export type ChartPieConfig = {
  [k in string | number]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};
