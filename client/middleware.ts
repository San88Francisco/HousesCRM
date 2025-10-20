import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Публічні роути, які доступні без авторизації
const PUBLIC_ROUTES = ['/login'];

// Роути, на які авторизовані користувачі не повинні мати доступ
const AUTH_ROUTES = ['/login'];

// Приватні роути, які потребують авторизації
const PROTECTED_ROUTES = [
  '/',
  '/all-apartments',
  '/apartments',
  '/dashboard',
  '/profile',
  '/uikit',
];

const isPublicRoute = (pathname: string) => PUBLIC_ROUTES.some(route => pathname.startsWith(route));

const isAuthRoute = (pathname: string) => AUTH_ROUTES.some(route => pathname.startsWith(route));

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Отримуємо access token з cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // Якщо це публічний роут, пропускаємо
  if (isPublicRoute(pathname)) {
    // Якщо користувач авторизований і намагається зайти на сторінку логіну
    if (accessToken && isAuthRoute(pathname)) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/all-apartments';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Якщо це приватний роут і немає токена - редірект на логін
  if (isProtectedRoute(pathname) && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    // Зберігаємо URL, на який користувач намагався зайти (але не "/")
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Якщо користувач заходить на "/" з токеном - редірект на /all-apartments
  if (pathname === '/' && accessToken) {
    return NextResponse.redirect(new URL('/all-apartments', request.url));
  }

  return NextResponse.next();
}

// Вказуємо, на які роути middleware повинен спрацьовувати
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
