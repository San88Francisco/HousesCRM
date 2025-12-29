'use client';

import { Sidebar, SidebarContent } from '@/shared/ui/sidebar';
import { usePathname } from 'next/navigation';
import { SidebarHeaderComponent } from './SidebarHeader';
import { SidebarPagesGroup } from './SidebarPagesGroup';

import { shouldShowSidebar } from '@/shared/utils/sidebar/should-show-sidebar';
import { LogoSidebar } from './LogoSidebar';
import { SidebarActionsGroup } from './SidebarActionsGroup';
import { SidebarFavoritesGroup } from './SidebarFavoritesGroup';

export const AppSidebar = () => {
  const pathname = usePathname();

  if (!shouldShowSidebar(pathname)) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderComponent />
      <SidebarContent>
        <SidebarPagesGroup />
        <SidebarActionsGroup />
        <SidebarFavoritesGroup />
      </SidebarContent>
      <LogoSidebar />
    </Sidebar>
  );
};
