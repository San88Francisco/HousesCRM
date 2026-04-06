import { EMPTY_DISPLAY } from '@/shared/constants/ui/empty-display';

export const formatFullName = (
  firstName?: string | null,
  lastName?: string | null,
  empty: string = EMPTY_DISPLAY,
): string => {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  return name || empty;
};
