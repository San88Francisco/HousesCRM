'use client';

import Link from 'next/link';
import {
  SidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarMenuItemProps } from '@/types/navigation';
import { getSidebarMenuItemClasses } from '@/constants/styles/sidebar';

export const SidebarMenuItem = ({ item, isActive }: SidebarMenuItemProps) => {
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
        <Link href={item.url}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
};
