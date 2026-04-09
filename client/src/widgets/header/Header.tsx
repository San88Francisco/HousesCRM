'use client';
import { useIsMobile } from '@/hooks';
import { ROUTES } from '@/shared/routes';
import { shouldShowSidebar } from '@/shared/utils/sidebar/should-show-sidebar';
import { ThemeSwitch } from '@/widgets/uikit/theme-drop-down/ThemeSwitch';
import { usePathname } from 'next/navigation';
import FavoriteStar from './FavoriteStar';
import HeaderNavigation from './HeaderNavigation';
import HeaderSearch from './HeaderSearch';
import { HeaderSettingsMenu } from './HeaderSettingsMenu';
import { MobileMenuTrigger } from './MobileMenuTrigger';

const headerBarClassName =
  'w-full border-b border-border bg-background shadow-[0_2px_10px_-2px_rgba(0,0,0,0.15)]';

const Header = () => {
  const pathname = usePathname();
  const { isMobile } = useIsMobile();

  const isAuthRoute = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

  if (isAuthRoute) return null;

  if (isMobile) {
    const showSidebarNav = shouldShowSidebar(pathname);

    return (
      <header className={`${headerBarClassName} sticky top-0 z-40 mb-3 md:hidden`}>
        <div className="flex min-h-[3.25rem] items-center gap-2 px-3 py-2">
          {showSidebarNav ? <MobileMenuTrigger /> : null}
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <FavoriteStar />
            <div className="min-w-0 flex-1 [&_nav]:max-w-full [&_ol]:flex-wrap [&_li]:min-w-0 [&_li]:truncate">
              <HeaderNavigation />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ThemeSwitch />
            <HeaderSettingsMenu />
          </div>
        </div>
        <div className="border-t border-border/70 px-3 py-2">
          <HeaderSearch />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`${headerBarClassName} mb-5 hidden items-center justify-between px-4 py-2 pl-8 md:flex`}
    >
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
