export function getApiErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string | string[] } }).data;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (typeof data?.message === 'string') return data.message;
  }
  return undefined;
}

export function extractApiMessage(err: unknown, fallback: string): string {
  return getApiErrorMessage(err) ?? fallback;
}
