export function getBackendApiRoot(): string | null {
  let raw = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
  if (!raw && process.env.NODE_ENV === 'development') {
    raw = 'http://localhost:8000';
  }
  if (!raw) return null;
  return raw.endsWith('/api') ? raw : `${raw}/api`;
}

export function getGoogleOAuthStartUrl(): string | null {
  const apiRoot = getBackendApiRoot();
  if (!apiRoot) return null;
  return `${apiRoot}/auth/google`;
}
