'use client';

import Link from 'next/link';
import {
  SidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
} from '@/components/ui/sidebar';

import { getSidebarMenuItemClasses } from '@/constants/styles/sidebar';
import { useAnimatedIcon } from '@/hooks';
import { NavItem } from '@/types/navigation';

type Props = {
  item: NavItem;
  isActive: boolean;
};
export const SidebarMenuItem = ({ item, isActive }: Props) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(item.icon);

  if (!item.url) return null;

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
