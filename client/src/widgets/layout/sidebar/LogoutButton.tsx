'use client';

import { ROUTES } from '@/shared/routes';
import { LogoutIcon } from '@/shared/ui/logout';
import { useSidebar } from '@/shared/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/utils/cn';
import { useLogoutMutation } from '@/store/api/auth-api';
import { useRouter } from 'next/navigation';

export const LogoutButton = () => {
  const router = useRouter();
  const { state } = useSidebar();
  const [logout, { isLoading }] = useLogoutMutation();

  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = ROUTES.LOGIN;
    }
  };

  const button = (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 py-2 rounded-[12px] transition-colors duration-200 w-full',
        'hover:bg-bg-input cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isCollapsed ? 'pl-0 justify-center' : 'pl-[13px]',
      )}
    >
      <LogoutIcon size={16} className="shrink-0 text-red" />
      {!isCollapsed && <span className="text-sm text-red">Вийти</span>}
    </button>
  );

  return isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" className="bg-foreground text-text border-border">
        <p>Вийти</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  );
};
