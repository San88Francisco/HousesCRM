'use client';

import { actionItems } from '@/shared/constants/sidebar/sidebar-action-items';
import { SIDEBAR_STYLES } from '@/shared/constants/styles/sidebar';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar';
import { SidebarActionItem } from './SidebarActionItem';

export const SidebarActionsGroup = () => {
  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.base}>
      <SidebarGroupLabel>Додавання</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className={SIDEBAR_STYLES.sidebarGroup.menu}>
          {actionItems.map(item => (
            <SidebarActionItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
