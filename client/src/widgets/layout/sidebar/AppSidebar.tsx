// client/src/widgets/layout/sidebar/AppSidebar.tsx
'use client';

import { itemsNav } from '@/shared/constants/sidebar/sidebarNavItems';
import { Sidebar, SidebarContent, useSidebar } from '@/shared/ui/sidebar';
import { usePathname } from 'next/navigation';
import { SidebarHeaderComponent } from './SidebarHeader';
import { SidebarPagesGroup } from './SidebarPagesGroup';
import { SidebarTablesGroup } from './SidebarTablesGroup';
import { Logo } from '@/components/Logo/Logo';
import { shouldShowSidebar } from '@/shared/utils/sidebar/should-show-sidebar';

type Props = {
  label: string;
};

export const AppSidebar = ({ label }: Props) => {
  const { state } = useSidebar();
  const pathname = usePathname();

  if (!shouldShowSidebar(pathname)) {
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
