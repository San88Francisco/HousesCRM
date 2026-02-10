'use client';

import { LogoutIcon } from '@/shared/ui/logout';
import { SidebarMenuButton } from '@/shared/ui/sidebar';
import { useLogoutMutation } from '@/store/api/auth-api';

export const LogoutButton = () => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <SidebarMenuButton
      onClick={() => logout()}
      disabled={isLoading}
      tooltip={{
        children: 'Вийти',
        className: `
          bg-foreground text-text
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
