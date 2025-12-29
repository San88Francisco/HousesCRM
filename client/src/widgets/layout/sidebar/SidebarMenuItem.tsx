'use client';

import Link from 'next/link';
import { useAnimatedIcon } from '@/hooks';
import { NavItem } from '@/types/navigation';
import { getSidebarMenuItemClasses } from '@/shared/constants/styles';
import { SidebarMenuButton, SidebarMenuItem as ShadcnSidebarMenuItem } from '@/shared/ui/sidebar';
import { isActiveItem } from '@/shared/utils/sidebar/navigation';
import { usePathname } from 'next/navigation';

type Props = {
  item: NavItem;
  hideTitle?: boolean;
};

export const SidebarMenuItem = ({ item, hideTitle = false }: Props) => {
  const pathname = usePathname();
  const isActive = isActiveItem(pathname, item.url);
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(item.icon);

  if (!item.url) return null;

  return (
    <ShadcnSidebarMenuItem className={getSidebarMenuItemClasses(isActive)}>
      <SidebarMenuButton
        asChild
        tooltip={{
          children: item.title,
          className: 'bg-background text-text border-border shadow-lg',
        }}
      >
        <Link href={item.url} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {animatedIcon}
          {!hideTitle && <span>{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
};
