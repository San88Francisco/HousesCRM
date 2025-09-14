'use client';

import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar';
import { itemsNav } from '@/constants/sidebarNavItems';
import { SidebarProps } from '@/types/navigation';
import { Logo } from '../Logo';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';

export const AppSidebar = ({ label }: SidebarProps) => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader state={state} label={label} />
      <SidebarContent>
        <SidebarPagesGroup items={itemsNav} />
        <SidebarTablesGroup items={itemsNav} />
      </SidebarContent>
      <Logo />
    </Sidebar>
  );
};
