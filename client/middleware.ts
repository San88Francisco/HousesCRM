/* eslint-disable */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

const ACCESS_TOKEN_AGE = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY; // 1 день
const REFRESH_TOKEN_AGE = ACCESS_TOKEN_AGE * DAYS_IN_WEEK; // 7 днів

const protectedRoutes = ['/', '/all-apartments', '/dashboard', '/profile'];

const isProtectedRoute = (pathname: string) =>
  protectedRoutes.some(route => pathname.startsWith(route));

const refreshAccessToken = async (
  origin: string,
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const response = await fetch(`${origin}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const middleware = async (req: NextRequest) => {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const { pathname, origin } = req.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    const data = await refreshAccessToken(origin, refreshToken);

    if (data) {
      const res = NextResponse.next();

      res.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ACCESS_TOKEN_AGE,
      });

      res.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_AGE,
      });

      return res;
    }
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/', '/all-apartments', '/dashboard', '/profile'],
};
