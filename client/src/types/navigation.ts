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

export interface SidebarProps {
  label: string;
}

export interface SidebarMenuItemProps {
  item: NavItem;
  pathname?: string;
  isActive: boolean;
}

export interface CollapsibleMenuProps {
  title: string;
  icon: ReactNode;
  items?: SubNavItem[];
}
