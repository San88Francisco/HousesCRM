import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value
  const refreshToken = req.cookies.get("refreshToken")?.value

  const protectedRoutes = ["/", "/all-apartments", "/dashboard", "/profile"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Якщо немає access token, але є refresh token
  if (!accessToken && refreshToken) {
    try {
      // Спробуємо оновити токен
      const response = await fetch(`${req.nextUrl.origin}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        const res = NextResponse.next()

        // Встановлюємо нові токени в cookies
        res.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 1 день
        })

        res.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 днів
        })

        return res
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }
  }

  // Якщо немає жодного токена або refresh не вдався
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/all-apartments", "/dashboard", "/profile"],
}
