import { THEMES } from '@/widgets/all-apartments/pie-chart-revenue-distribution/PieChart';
import React from 'react';

export type ChartConfig = {
  [k in string | number]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};
