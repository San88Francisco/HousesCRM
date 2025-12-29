import { LIKED_ROUTES_KEY } from '@/constants/breadcrumbs/breadcrumbs';

export type FavoriteItem = {
  id: string;
  path: string;
  type: string;
  name: string;
};

const isBrowser = () => typeof window !== 'undefined';

export const getFavoriteItems = (): FavoriteItem[] => {
  if (!isBrowser()) return [];

  const stored = localStorage.getItem(LIKED_ROUTES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      item =>
        item &&
        typeof item.id === 'string' &&
        typeof item.path === 'string' &&
        typeof item.type === 'string' &&
        typeof item.name === 'string',
    );
  } catch (e) {
    console.error('Failed to parse favorite items from localStorage:', e);
    return [];
  }
};

export const setFavoriteItems = (items: FavoriteItem[]) => {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(LIKED_ROUTES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('favorites-changed', { detail: items }));
  } catch (e) {
    console.error('Failed to save favorite items to localStorage:', e);
  }
};

export const isPathFavorite = (path: string): boolean => {
  const items = getFavoriteItems();
  return items.some(item => item.path === path);
};

export const toggleFavoriteItem = (
  item: FavoriteItem,
): {
  items: FavoriteItem[];
  isFavorite: boolean;
} => {
  const current = getFavoriteItems();
  const exists = current.some(f => f.path === item.path);

  const updated = exists ? current.filter(f => f.path !== item.path) : [...current, item];

  setFavoriteItems(updated);

  return { items: updated, isFavorite: !exists };
};
