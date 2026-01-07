'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import {
  FavoriteItem,
  isPathFavorite,
  toggleFavoriteItem,
} from '@/shared/utils/storage/favorites-storage';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';

const FavoriteStar = () => {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const { data } = useGetHouseByIdQuery(id, {
    skip: !id,
  });
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const favoriteItem: FavoriteItem | null = useMemo(() => {
    if (!pathname) return null;
    if (!data) return null;

    const isApartmentPage = pathname.startsWith(`${ROUTES.APARTMENT}/`);
    if (!isApartmentPage) return null;

    const segments = pathname.split(ROUTES.ROOT).filter(Boolean);

    return {
      id: segments[1],
      path: pathname,
      type: 'apartment',
      name: data?.houseDetail.apartmentName,
    };
  }, [pathname, data]);

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
