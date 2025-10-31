'use client';

import { usePathname } from 'next/navigation';
import { NavItem } from '@/types/navigation';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import { isActiveItem } from '@/shared/utils/sidebar/navigation';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/sidebar';

type Props = {
  items: NavItem[];
};

export const SidebarPagesGroup = ({ items }: Props) => {
  const pathname = usePathname();

  const pagesItems = items.filter(item => item.url);

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.base}>
      <SidebarGroupLabel>Сторінки</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className={SIDEBAR_STYLES.sidebarGroup.menu}>
          {pagesItems.map(item => {
            const isActive = isActiveItem(pathname, item.url);

            return <SidebarMenuItem key={item.title} item={item} isActive={isActive} />;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
