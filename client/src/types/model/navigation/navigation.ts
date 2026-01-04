import { ReactNode } from 'react';

export interface SubNavItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url?: string;
  icon: ReactNode;
  items?: SubNavItem[];
}
