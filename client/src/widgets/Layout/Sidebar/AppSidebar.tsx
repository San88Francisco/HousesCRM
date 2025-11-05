'use client';

import { ROUTES } from '@/shared/routes';
import { Sidebar, SidebarContent, useSidebar } from '@/shared/ui/sidebar';
import { usePathname } from 'next/navigation';
import { SidebarHeaderComponent } from './SidebarHeader';
import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';
import { Logo } from '@/components/Logo';
import { itemsNav } from '@/shared/constants/sidebar/sidebarNavItems';

type Props = {
  label: string;
};

export const AppSidebar = ({ label }: Props) => {
  const { state } = useSidebar();
  const pathname = usePathname();

  const allowedRoutes = [ROUTES.ALL_APARTMENTS, ROUTES.HOME, ROUTES.UIKIT];

  if (!allowedRoutes.includes(pathname)) {
    return null;
  }
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
