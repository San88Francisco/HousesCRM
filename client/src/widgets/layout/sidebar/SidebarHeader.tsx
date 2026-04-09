'use client';

import { useIsMobile, useUser } from '@/hooks';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/shared/ui/sidebar';
import { cn } from '@/shared/utils/cn';
import Image from 'next/image';

export const SidebarHeaderComponent = () => {
  const { email } = useUser();
  const { isMobile } = useIsMobile();
  const { state } = useSidebar();
  return (
    <SidebarHeader
      className={cn(
        'flex items-center px-4 pt-4',
        isMobile ? 'justify-start' : state === 'collapsed' ? 'justify-center p-2' : 'gap-2',
      )}
    >
      <SidebarMenu
        className={cn(!isMobile && state === 'collapsed' && 'w-full flex justify-center')}
      >
        <SidebarMenuItem
          className={cn(!isMobile && state === 'collapsed' && 'flex w-full justify-center')}
        >
          <div
            className={cn(
              'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding]',
              !isMobile && state === 'collapsed' && 'w-full flex justify-center',
            )}
          >
            <div className="relative h-7 w-7 group/avatar flex-shrink-0">
              <Image
                className={cn('rounded-full h-7 w-7 object-cover transition-opacity flex-shrink-0')}
                alt="avatar"
                src="/avatar.png"
                width={28}
                height={28}
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap group-data-[collapsible=icon]:hidden">
              {email || 'Guest'}
            </span>
          </div>
          {!isMobile ? (
            <div className="ml-auto">
              <SidebarTrigger className="h-7 w-7 p-0" />
            </div>
          ) : null}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
