import { getClientApiBaseUrl } from '@/shared/constants/api-base-url';
import { tokenStorage } from '@/shared/utils/auth';

export type RefreshOutcome = 'refreshed' | 'unauthorized' | 'error';

let inflight: Promise<RefreshOutcome> | null = null;

async function doRefresh(): Promise<RefreshOutcome> {
  try {
    const res = await fetch(`${getClientApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) {
      return 'unauthorized';
    }

    if (!res.ok) {
      return 'error';
    }

    const data = (await res.json()) as { accessToken?: string };
    if (!data.accessToken) {
      return 'error';
    }

    tokenStorage.setAccessToken(data.accessToken);
    return 'refreshed';
  } catch {
    return 'error';
  }
}

export function refreshSession(): Promise<RefreshOutcome> {
  if (!inflight) {
    inflight = doRefresh().finally(() => {
      inflight = null;
    });
  }

  return inflight;
}
