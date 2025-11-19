import { THEMES } from '@/shared/constants/pie-chart/chartThemes';
import React from 'react';

export type ChartPieConfig = {
  [k in string | number]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};
