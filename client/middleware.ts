/* eslint-disable */

import { ROUTES } from '@/shared/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [ROUTES.ALL_APARTMENTS, ROUTES.HOME, ROUTES.UIKIT];

const AUTH_ROUTES = [ROUTES.LOGIN];

const PROTECTED_ROUTES = [ROUTES.ALL_APARTMENTS, ROUTES.HOME, ROUTES.UIKIT];

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.some(route => pathname.startsWith(route));

const isAuthRoute = (pathname: string) => AUTH_ROUTES.some(route => pathname.startsWith(route));

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;

  if (isPublicRoute(pathname)) {
    if (accessToken && isAuthRoute(pathname)) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || ROUTES.ALL_APARTMENTS;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) && !accessToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL(ROUTES.ALL_APARTMENTS, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};
