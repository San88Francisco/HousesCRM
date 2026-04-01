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
      className="
        text-red
        hover:bg-bg-input
        text-center
      "
    >
      <LogoutIcon size={16} />
      Вийти
    </SidebarMenuButton>
  );
};
