import { ComponentType, ReactNode } from 'react';

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

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
