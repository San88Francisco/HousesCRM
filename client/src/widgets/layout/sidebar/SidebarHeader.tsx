'use client';
/* eslint-disable */

import Image from 'next/image';
import { cn } from '@/shared/utils/cn';
import {
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar';
import { useUser } from '@/hooks/use-user';

export const SidebarHeaderComponent = () => {
  const { email } = useUser();
  const { state } = useSidebar();
  return (
    <SidebarHeader
      className={cn(
        'flex items-center p-4',
        state === 'collapsed' ? 'justify-center p-2' : 'gap-2',
      )}
    >
      <SidebarMenu className={cn(state === 'collapsed' && 'w-full flex justify-center')}>
        <SidebarMenuItem className={cn(state === 'collapsed' && 'flex justify-center w-full')}>
          <div
            className={cn(
              'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding]',
              state === 'collapsed' && 'w-full flex justify-center',
            )}
          >
            <div className="relative h-7 w-7 group/avatar flex-shrink-0">
              <Image
                className={cn(
                  'rounded-full h-7 w-7 object-cover transition-opacity flex-shrink-0',
                  state === 'collapsed' && 'group-hover/avatar:opacity-0',
                )}
                alt="avatar"
                src="/avatar.png"
                width={28}
                height={28}
              />
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  state === 'collapsed'
                    ? 'opacity-0 group-hover/avatar:opacity-100 transition-opacity'
                    : 'hidden',
                )}
              >
                <SidebarTrigger className="h-7 w-7 p-0 " />
              </div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap group-data-[collapsible=icon]:hidden">
              {email || 'Guest'}
            </span>
          </div>
          {state === 'expanded' && (
            <div className="ml-auto">
              <SidebarTrigger className="h-7 w-7 p-0" />
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
