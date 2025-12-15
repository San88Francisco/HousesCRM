'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/sidebar';
import { SidebarActionItem } from './SidebarActionItem';
import { actionItems } from '@/shared/constants/sidebar/sidebarActionItems';

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
