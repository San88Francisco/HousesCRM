'use client';
import { ThemeSwitch } from '@/widgets/uikit/theme-drop-down';
import HeaderNavigation from './HeaderNavigation';
import HeaderSearch from './HeaderSearch';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/routes';
import { useIsMobile } from '@/hooks';

const Header = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isAuthRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

  if (isAuthRoute || isMobile) return null;

  return (
    <header className="w-full mb-5 border-b border-border flex items-center justify-between px-4 py-2 pl-8 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.15)]">
      <HeaderNavigation />
      <div className="flex items-center gap-3">
        <HeaderSearch />
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
