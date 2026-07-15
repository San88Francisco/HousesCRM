'use client';

import { refreshSession } from '@/shared/api/refresh-session';
import { isPublicAuthPath } from '@/shared/routes';
import { tokenStorage } from '@/shared/utils/auth';
import { getJwtExpSeconds } from '@/shared/utils/auth/jwt';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REFRESH_THRESHOLD_SEC = 120;
const TICK_MS = 45_000;

function shouldRefreshSoon(pathname: string): boolean {
  const token = tokenStorage.getAccessToken();

  if (!token) {
    return !isPublicAuthPath(pathname);
  }

  const exp = getJwtExpSeconds(token);
  if (exp === null) return false;

  const secondsLeft = exp - Date.now() / 1000;
  return secondsLeft < REFRESH_THRESHOLD_SEC;
}

export function SessionKeepAlive(): null {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      if (isPublicAuthPath(pathname)) return;
      if (!shouldRefreshSoon(pathname)) return;
      void refreshSession();
    };

    run();
    const interval = window.setInterval(run, TICK_MS);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') run();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pathname]);

  return null;
}
