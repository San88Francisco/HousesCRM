import { ReactNode } from 'react';

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

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

export interface SidebarProps {
  label: string;
}

export interface SidebarMenuItemProps {
  item: NavItem;
  isActive: boolean;
}

export interface CollapsibleMenuProps {
  title: string;
  icon: ReactNode;
  items?: SubNavItem[];
}
