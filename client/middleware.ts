import { ROUTES } from '@/shared/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value ?? null;
  const pathname = request.nextUrl.pathname;

  const PUBLIC_PATHS = [ROUTES.ALL_HOUSES];

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (token && pathname === ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.ALL_HOUSES, request.url));
  }

  if (!token && pathname !== ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
