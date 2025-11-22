/* eslint-disable */

import { ROUTES } from '@/shared/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value ?? null;
  const pathname = request.nextUrl.pathname;

  // 1. Авторизований користувач НЕ може бачити /login
  if (token && pathname === ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.ALL_APARTMENTS, request.url));
  }

  // 2. НЕавторизований може бачити тільки /login
  if (!token && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login).*)'],
};
