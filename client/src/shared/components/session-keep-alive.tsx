'use client';

import { getClientApiBaseUrl } from '@/shared/constants/api-base-url';
import { isPublicAuthPath } from '@/shared/routes';
import { tokenStorage } from '@/shared/utils/auth';
import { getJwtExpSeconds } from '@/shared/utils/auth/jwt';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REFRESH_THRESHOLD_SEC = 120;
const TICK_MS = 45_000;

async function tryRefreshAccessToken(): Promise<void> {
  const baseUrl = getClientApiBaseUrl();
  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    return;
  }
  const data = (await res.json()) as { accessToken?: string };
  if (data.accessToken) {
    tokenStorage.setAccessToken(data.accessToken);
  }
}

function shouldRefreshSoon(): boolean {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    return true;
  }
  const exp = getJwtExpSeconds(token);
  if (exp === null) {
    return false;
  }
  const secondsLeft = exp - Date.now() / 1000;
  return secondsLeft < REFRESH_THRESHOLD_SEC;
}

export function SessionKeepAlive(): null {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      if (isPublicAuthPath(pathname)) return;
      if (!shouldRefreshSoon()) {
        return;
      }
      void tryRefreshAccessToken();
    };

    run();
    const interval = window.setInterval(run, TICK_MS);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        run();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pathname]);

  return null;
}
