'use client';

import { LogoutIcon } from '@/shared/ui/logout';
import { SidebarMenuButton } from '@/shared/ui/sidebar';
import { useLogoutMutation } from '@/store/api/auth-api';
import { useCallback } from 'react';

export const LogoutButton = () => {
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <SidebarMenuButton
      onClick={handleLogout}
      disabled={isLoading}
      tooltip={{
        children: 'Вийти',
        className: `
          bg-white text-black
          dark:bg-black dark:text-white
          border border-border
        `,
      }}
      className="
        text-red
        hover:bg-bg-input
        data-[active=true]:text-red
        [&>span]:text-red
      "
    >
      <LogoutIcon size={16} />
      <span>Вийти</span>
    </SidebarMenuButton>
  );
};
