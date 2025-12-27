'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/sidebar';
import { SidebarMenuItem } from './SidebarMenuItem';
import { itemsNav } from '@/shared/constants/sidebar/sidebar-nav-items';

export const SidebarPagesGroup = () => {
  const pagesItems = itemsNav.filter(item => item.url);

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.base}>
      <SidebarGroupLabel>Сторінки</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className={SIDEBAR_STYLES.sidebarGroup.menu}>
          {pagesItems.map(item => (
            <SidebarMenuItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
