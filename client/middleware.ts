import { ROUTES } from '@/shared/routes';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const REFRESH_COOKIE_NAME = process.env.JWT_REFRESH_COOKIE ?? 'refresh_token';

interface RefreshResult {
  accessToken: string;
  setCookieHeader: string | null;
}

async function tryRefresh(request: NextRequest): Promise<RefreshResult | null> {
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  const rawBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
  const apiBase = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

  try {
    const res = await fetch(`${apiBase}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
        'User-Agent': request.headers.get('user-agent') ?? 'unknown',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { accessToken?: string };
    if (!data.accessToken) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      setCookieHeader: res.headers.get('set-cookie'),
    };
  } catch {
    return null;
  }
}

function applyRefreshToResponse(response: NextResponse, refreshed: RefreshResult): void {
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('access_token', refreshed.accessToken, {
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    maxAge: 15 * 60,
  });

  if (refreshed.setCookieHeader) {
    response.headers.append('set-cookie', refreshed.setCookieHeader);
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const PUBLIC_PATHS: string[] = [];
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get('access_token')?.value ?? null;
  let refreshed: RefreshResult | null = null;

  if (!accessToken) {
    refreshed = await tryRefresh(request);
    if (refreshed) {
      accessToken = refreshed.accessToken;
    }
  }

  if (accessToken && (pathname === ROUTES.LOGIN || pathname === ROUTES.ROOT)) {
    const response = NextResponse.redirect(new URL(ROUTES.ALL_HOUSES, request.url));
    if (refreshed) {
      applyRefreshToResponse(response, refreshed);
    }
    return response;
  }

  if (!accessToken && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  const response = NextResponse.next();
  if (refreshed) {
    applyRefreshToResponse(response, refreshed);
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
