import { CHART_THEMES } from '@/shared/constants/chart';
import { ComponentType, ReactNode } from 'react';

export type PieConfigChart = {
  [k in string | number]: {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof CHART_THEMES, string> }
  );
};
