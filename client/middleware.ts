/* eslint-disable */

import { ROUTES } from '@/shared/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (token && pathname === ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.ALL_APARTMENTS, request.url));
  }

  if (!token && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
