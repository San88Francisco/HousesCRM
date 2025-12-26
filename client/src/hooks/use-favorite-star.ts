'use client';

import { useCallback, useEffect, useState } from 'react';
import { FavoriteItem, getFavoriteItems } from '@/shared/utils/storage/favorites-storage';

export const useFavoriteStar = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const refresh = useCallback(() => {
    setFavorites(getFavoriteItems());
  }, []);

  useEffect(() => {
    refresh();

    const onCustom = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'likedRoutes') refresh();
    };

    window.addEventListener('favorites-changed', onCustom);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('favorites-changed', onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  return favorites;
};
