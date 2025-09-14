'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavItem } from '@/types/navigation';
import { CollapsibleMenu } from './CollapsibleMenu';
import { SIDEBAR_STYLES } from '@/constants/styles/sidebar';

type SidebarTablesGroupProps = {
  items: NavItem[];
};

export const SidebarTablesGroup = ({ items }: SidebarTablesGroupProps) => {
  const tablesItems = items.filter(item => !item.url);

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.hidden}>
      <SidebarGroupLabel>Таблиці</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {tablesItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <CollapsibleMenu title={item.title} icon={item.icon} items={item.items} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
