import { ROUTES } from '@/shared/routes';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value ?? null;
  const refreshToken = request.cookies.get('refresh_token')?.value ?? null;
  const pathname = request.nextUrl.pathname;

  if (accessToken && (pathname === ROUTES.LOGIN || pathname === ROUTES.ROOT)) {
    return NextResponse.redirect(new URL(ROUTES.ALL_HOUSES, request.url));
  }

  if (!accessToken && !refreshToken && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
