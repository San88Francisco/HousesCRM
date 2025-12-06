'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  FavoriteItem,
  isPathFavorite,
  toggleFavoriteItem,
} from '@/shared/utils/storage/favorites-storage';

const FavoriteStar = () => {
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteItem: FavoriteItem | null = (() => {
    if (!pathname) return null;

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length < 2) return null;

    const type = segments[0];
    const id = segments[1];

    return {
      id,
      path: pathname,
      type,
    };
  })();

  useEffect(() => {
    if (!favoriteItem) {
      setIsFavorite(false);
      return;
    }

    const initial = isPathFavorite(favoriteItem.path);
    setIsFavorite(initial);
  }, [favoriteItem?.path]);

  const handleToggle = () => {
    if (!favoriteItem) return;

    const { isFavorite: next } = toggleFavoriteItem(favoriteItem);
    setIsFavorite(next);
  };

  return (
    <Button
      variant="icon"
      className="w-10 h-10 bg-transparent"
      onClick={handleToggle}
      disabled={!favoriteItem}
    >
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
