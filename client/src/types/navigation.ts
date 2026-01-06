import { ComponentType, ReactNode } from 'react';
export type { FileChartLineIconHandle as AnimatedIconHandle } from '@/shared/ui/file-chart-line-icon-handle';

export type SubNavItem = {
  title: string;
  url: string;
  icon?: ComponentType<{ className?: string }>;
};

export interface NavItem {
  title: string;
  url?: string;
  icon: ReactNode;
  items?: SubNavItem[];
}
