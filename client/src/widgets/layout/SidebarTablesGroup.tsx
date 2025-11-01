'use client';

import { NavItem } from '@/types/navigation';
import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { CollapsibleMenu } from './CollapsibleMenu';

type Props = {
  items: NavItem[];
};

export const SidebarTablesGroup = ({ items }: Props) => {
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
