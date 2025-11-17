import { ROUTES_WITH_SIDEBAR, SIDEBAR_PATTERNS } from '@/shared/routes';

export const shouldShowSidebar = (pathname: string): boolean => {
  if (ROUTES_WITH_SIDEBAR.includes(pathname)) {
    return true;
  }

  return SIDEBAR_PATTERNS.some(pattern => pattern.test(pathname));
};
