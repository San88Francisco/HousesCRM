function decodeJwtPayloadSegment(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return decodeURIComponent(
    [...atob(padded)].map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''),
  );
}

export function getJwtExpSeconds(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }
    const payload = JSON.parse(decodeJwtPayloadSegment(parts[1])) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}
