'use client';
import { ThemeSwitch } from '@/widgets/uikit/theme-drop-down';
import HeaderNavigation from './HeaderNavigation';
import HeaderSearch from './HeaderSearch';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/routes';

const Header = () => {
  const pathname = usePathname() ?? '/';
  const last = pathname.split('/').filter(Boolean).pop();

  if (last === ROUTES.LOGIN || last === ROUTES.REGISTER) return null;

  return (
    <header className="w-full border-b border-border flex items-center justify-between px-4 py-2 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.15)]">
      <HeaderNavigation />
      <div className="flex items-center gap-3">
        <HeaderSearch />
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
