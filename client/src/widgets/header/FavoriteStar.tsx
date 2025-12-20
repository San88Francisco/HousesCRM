'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  FavoriteItem,
  isPathFavorite,
  toggleFavoriteItem,
} from '@/shared/utils/storage/favorites-storage';
import { ROUTES } from '@/shared/routes';

const FavoriteStar = () => {
  const pathname = usePathname();

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const favoriteItem: FavoriteItem | null = useMemo(() => {
    if (!pathname) return null;

    const segments = pathname.split('/').filter(Boolean);
    const isApartmentPage = segments[0] === ROUTES.APARTMENT && Boolean(segments[1]);

    if (!isApartmentPage) return null;

    return {
      id: segments[1],
      path: pathname,
      type: 'apartment',
    };
  }, [pathname]);

  useEffect(() => {
    if (!favoriteItem) {
      setIsFavorite(false);
      return;
    }

    setIsFavorite(isPathFavorite(favoriteItem.path));
  }, [favoriteItem]);

  const handleToggle = () => {
    if (!favoriteItem) return;

    const { isFavorite: next } = toggleFavoriteItem(favoriteItem);
    setIsFavorite(next);
  };

  if (!favoriteItem) return null;

  return (
    <Button variant="icon" className="w-10 h-10 bg-transparent" onClick={handleToggle}>
      <motion.div
        animate={isFavorite ? { scale: [1, 1.3, 0.9, 1] } : { scale: [1, 1.15, 1] }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Star
          className={
            isFavorite
              ? 'text-[color:gold] fill-[color:gold] drop-shadow-[0_0_6px_rgba(245,197,66,0.55)]'
              : 'text-text'
          }
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </motion.div>
    </Button>
  );
};

export default FavoriteStar;
