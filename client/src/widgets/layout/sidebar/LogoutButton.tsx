'use client';

import { useAnimatedIcon } from '@/hooks';
import { LogoutIcon } from '@/shared/ui/logout';
import { SidebarMenuButton } from '@/shared/ui/sidebar';
import { useLogoutMutation } from '@/store/api/auth-api';

export const LogoutButton = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(
    <LogoutIcon size={16} />,
  );

  return (
    <SidebarMenuButton
      onClick={() => logout()}
      disabled={isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        text-red
        hover:bg-bg-input
        text-center
      "
    >
      {animatedIcon}
      Вийти
    </SidebarMenuButton>
  );
};
