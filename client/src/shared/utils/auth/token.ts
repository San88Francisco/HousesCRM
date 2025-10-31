'use server';

import { cookies } from 'next/headers';

export async function setCookie(
  name: string,
  value: string,
  options?: { expires?: Date | number; path?: string },
) {
  (await cookies()).set(name, value, options);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}
