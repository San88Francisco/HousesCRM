'use client';

import { rootApi } from '@/shared/api';
import { getBackendApiRoot } from '@/shared/utils/backend-url';
import { tokenStorage } from '@/shared/utils/auth';
import { ROUTES } from '@/shared/routes';
import { setUser } from '@/store/slice/user-slice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

/**
 * After Google OAuth the API redirects to /login#accessToken=… so the token is stored on the frontend
 * domain (required when API and Next.js are on different hosts).
 */
export const GoogleOAuthHashHandler = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get('accessToken');
    if (!accessToken) return;

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);

    void (async () => {
      try {
        tokenStorage.setAccessToken(accessToken);
        dispatch(rootApi.util.resetApiState());

        const apiRoot = getBackendApiRoot();
        if (!apiRoot) {
          throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
        }

        const res = await fetch(`${apiRoot}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Profile request failed');
        }

        const profile = (await res.json()) as { email: string };
        tokenStorage.setUserData({ email: profile.email });
        dispatch(setUser({ email: profile.email }));

        toast.success('Увійшли успішно');
        router.replace(ROUTES.ALL_HOUSES);
      } catch {
        toast.error('Не вдалося завершити вхід через Google');
      }
    })();
  }, [dispatch, router]);

  return null;
};
