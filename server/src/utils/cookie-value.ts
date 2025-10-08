export const fromCookie = (cookieName: string) => {
  return (req: Request | null): string | null => {
    const value = (req as unknown as { cookies?: Record<string, unknown> })?.cookies?.[cookieName]
    return typeof value === 'string' ? value : null
  }
}
