import * as React from 'react';

export const THEMES = { light: '', dark: '.dark' } as const;

export type ChartDataItem = {
  apartmentName: string;
  apartmentTotalRevenue: number;
  percentage: number;
  fill: string;
};

export type ChartConfig = {
  [k in string | number]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};
