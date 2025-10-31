'use client';

import { Logo } from '../../../components/Logo';
import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';
import { SidebarHeaderComponent } from './SidebarHeader';
import { itemsNav } from '@/shared/constants/sidebar/sidebarNavItems';
import { useSidebar, Sidebar, SidebarContent } from '@/shared/ui/sidebar';

type Props = {
  label: string;
};

export const AppSidebar = ({ label }: Props) => {
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
