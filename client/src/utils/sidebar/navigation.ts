import { ROUTES } from '@/routes';

export const isActiveItem = (currentPathname: string, itemUrl?: string) => {
  if (!itemUrl) return false;

  const currentSegment = currentPathname.split(ROUTES.HOME).pop() || '';

  const itemSegment = itemUrl.split(ROUTES.HOME).pop() || '';

  return currentSegment === itemSegment;
};
