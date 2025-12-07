import { SIDEBAR_PATTERNS } from '@/shared/routes';

export const shouldShowSidebar = (pathname: string): boolean => {
  return SIDEBAR_PATTERNS.some(pattern => pattern.test(pathname));
};
