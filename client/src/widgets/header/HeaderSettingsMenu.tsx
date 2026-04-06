'use client';

import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { LogoutIcon } from '@/shared/ui/logout';
import { SettingsIcon } from '@/shared/ui/settings';
import { UserIcon } from '@/shared/ui/user';
import { useLogoutMutation } from '@/store/api/auth-api';
import Link from 'next/link';

export const HeaderSettingsMenu = () => {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="icon"
          size="lg"
          className="h-10 w-10"
          type="button"
          aria-label="Меню облікового запису"
        >
          <SettingsIcon size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="font-normal">
          <Link href={ROUTES.PROFILE_PERSONAL} className="gap-2">
            <UserIcon size={16} />
            Профіль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isLoading}
          className="gap-2 font-normal text-red focus:text-red hover:bg-bg-input"
          onClick={() => logout()}
        >
          <LogoutIcon size={16} />
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
