'use client';
import { useIsMobile } from '@/hooks';
import { ROUTES } from '@/shared/routes';
import { ThemeSwitch } from '@/widgets/uikit/theme-drop-down/ThemeSwitch';
import { usePathname } from 'next/navigation';
import FavoriteStar from './FavoriteStar';
import HeaderNavigation from './HeaderNavigation';
import HeaderSearch from './HeaderSearch';
import { HeaderSettingsMenu } from './HeaderSettingsMenu';

const Header = () => {
  const pathname = usePathname();
  const { isMobile } = useIsMobile();

  const isAuthRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

  if (isAuthRoute || isMobile) return null;

  return (
    <header className="w-full mb-5  border-b border-border flex items-center justify-between px-4 py-2 pl-8 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.15)]">
      <div className="flex items-center ">
        <FavoriteStar />
        <HeaderNavigation />
      </div>

      <div className="flex items-center gap-3">
        <HeaderSearch />
        <ThemeSwitch />
        <HeaderSettingsMenu />
      </div>
    </header>
  );
};

export default Header;
