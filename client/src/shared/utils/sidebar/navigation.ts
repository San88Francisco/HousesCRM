import { ROUTES } from '@/shared/routes';

export const isActiveItem = (currentPathname: string, itemUrl?: string) => {
  if (!itemUrl) {
    return false;
  }

  const currentSegment = currentPathname.split(ROUTES.ROOT).pop() || '';

  const itemSegment = itemUrl.split(ROUTES.ROOT).pop() || '';

  return currentSegment === itemSegment;
};
