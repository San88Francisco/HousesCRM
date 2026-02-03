import { STORAGE_KEY } from '@/shared/constants/header/header-breadcrumb';
import { Crumb } from '@/types/core/header/header-breadcrumb';

export const localStorageService = {
  load: (): Crumb[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item): item is Crumb =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.label === 'string' &&
          typeof item.href === 'string' &&
          typeof item.level === 'number',
      );
    } catch {
      return [];
    }
  },
  save: (crumbs: Crumb[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crumbs));
    } catch (error) {
      console.error('Failed to add breadcrumb to localstorage', error);
    }
  },
};
