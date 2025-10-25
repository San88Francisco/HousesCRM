import { Request } from 'express'

export const fromCookie = (cookieName: string) => {
  return (req: Request): string | null => {
    return (req.cookies[cookieName] as string) ?? null
  }
}
