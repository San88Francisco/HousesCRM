import { RouteKey, ROUTES } from '@/shared/routes';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const navigateToItem = (router: AppRouterInstance, type: RouteKey, id: string) => {
  router.push(`${ROUTES[type]}/${id}`);
};
