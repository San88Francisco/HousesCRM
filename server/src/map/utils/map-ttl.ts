export function msUntilNextFirstOfMonth(): number {
  const now = new Date()
  const nextFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
  return nextFirst.getTime() - now.getTime()
}
