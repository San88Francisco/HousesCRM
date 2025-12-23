'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { CollapsibleMenu } from './ColapsibleMenu';
import { itemsNav } from '@/shared/constants/sidebar/sidebarNavItems';

export const SidebarTablesGroup = () => {
  const tablesItems = itemsNav.filter(item => !item.url);

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.hidden}>
      <SidebarGroupLabel>Таблиці</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tablesItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <CollapsibleMenu title={item.title} icon={item.icon} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
