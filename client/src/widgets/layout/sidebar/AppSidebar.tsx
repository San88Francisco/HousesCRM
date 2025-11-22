'use client';

import { itemsNav } from '@/shared/constants/sidebar/sidebarNavItems';
import { Sidebar, SidebarContent, useSidebar } from '@/shared/ui/sidebar';
import { usePathname } from 'next/navigation';
import { SidebarHeaderComponent } from './SidebarHeader';
import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';
import { Logo } from '@/components/logo/Logo';
import { shouldShowSidebar } from '@/shared/utils/sidebar/should-show-sidebar';
import { useUser } from '@/hooks/use-user';

export const AppSidebar = () => {
  const { email } = useUser();
  const { state } = useSidebar();
  const pathname = usePathname();

  if (!shouldShowSidebar(pathname)) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderComponent state={state} label={email || 'Guest'} />
      <SidebarContent>
        <SidebarPagesGroup items={itemsNav} />
        <SidebarTablesGroup items={itemsNav} />
      </SidebarContent>
      <Logo />
    </Sidebar>
  );
};
