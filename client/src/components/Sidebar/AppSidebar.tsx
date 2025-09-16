'use client';

import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar';
import { itemsNav } from '@/constants/sidebarNavItems';
import { SidebarProps } from '@/types/navigation';
import { Logo } from '../Logo';

import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';
import { SidebarHeaderComponent } from './SidebarHeader';

export const AppSidebar = ({ label }: SidebarProps) => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderComponent state={state} label={label} />
      <SidebarContent>
        <SidebarPagesGroup items={itemsNav} />
        <SidebarTablesGroup items={itemsNav} />
      </SidebarContent>
      <Logo />
    </Sidebar>
  );
};
