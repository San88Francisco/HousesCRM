'use client';

import Link from 'next/link';
import { useAnimatedIcon } from '@/hooks';
import { NavItem } from '@/types/navigation';
import { getSidebarMenuItemClasses } from '@/shared/constants/styles';
import { SidebarMenuButton, SidebarMenuItem as ShadcnSidebarMenuItem } from '@/shared/ui/sidebar';

type Props = {
  item: NavItem;
  isActive: boolean;
};
export const SidebarMenuItem = ({ item, isActive }: Props) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(item.icon);

  if (!item.url) {
    return null;
  }

  return (
    <ShadcnSidebarMenuItem className={getSidebarMenuItemClasses(isActive)}>
      <SidebarMenuButton
        asChild
        tooltip={{
          children: item.title,
          className: 'bg-text text-background',
        }}
      >
        <Link href={item.url} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {animatedIcon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
};
