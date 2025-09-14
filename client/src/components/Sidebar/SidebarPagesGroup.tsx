'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { NavItem } from '@/types/navigation';
import { SidebarMenuItem } from './SidebarMenuItem';
import { isActiveItem } from '@/utils/sidebar/navigation';
import { SIDEBAR_STYLES } from '@/constants/styles/sidebar';

type SidebarPagesGroupProps = {
  items: NavItem[];
};

export const SidebarPagesGroup = ({ items }: SidebarPagesGroupProps) => {
  const pathname = usePathname();

  const pagesItems = items.filter(item => item.url);

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.base}>
      <SidebarGroupLabel>Сторінки</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className={SIDEBAR_STYLES.sidebarGroup.menu}>
          {pagesItems.map(item => {
            const isActive = isActiveItem(pathname, item.url);

            return (
              <SidebarMenuItem
                key={item.title}
                item={item}
                pathname={pathname}
                isActive={isActive}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
