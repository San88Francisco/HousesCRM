'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { itemsNav } from '@/constants/sidebarNavItems';
import Link from 'next/link';
import { ThemeDropdown } from '../ThemeDropDown/ThemeDropDown';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function AppSidebar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsNav.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t w-full flex gap-2">
        <div className="flex-1">
          <ThemeDropdown />
        </div>

        {isAuthenticated && (
          <Button
            onClick={logout}
            variant="outline"
            size="lg"
            className="flex-1 flex items-center justify-center dark:text-[var(--muted-foreground)]"
          >
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        )}
      </div>
    </Sidebar>
  );
}
