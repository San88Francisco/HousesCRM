'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';

import { FavoriteItem, isPathFavorite, toggleFavoriteItem } from '@/shared/utils/storage';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { useGetAllContractsByRenterIdQuery } from '@/store/api/renters-api';

const FavoriteStar = () => {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: houseData } = useGetHouseByIdQuery(id, {
    skip: !id || !pathname?.startsWith(`${ROUTES.HOUSE}/`),
  });

  const { data: renterData } = useGetAllContractsByRenterIdQuery(
    { renterId: id },
    { skip: !id || !pathname?.startsWith(`${ROUTES.RENTER}/`) },
  );

  const favoriteItem: FavoriteItem | null = useMemo(() => {
    if (!pathname) return null;

    const allowedRoutes = [ROUTES.HOUSE, ROUTES.RENTER];
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(`${route}/`));
    if (!isAllowed) return null;

    const segments = pathname.split(ROUTES.ROOT).filter(Boolean);
    const itemId = segments[1];

    if (pathname.startsWith(`${ROUTES.HOUSE}/`) && houseData) {
      return {
        id: itemId,
        path: pathname,
        type: 'apartment',
        name: houseData.houseDetail.apartmentName,
      };
    }

    if (pathname.startsWith(`${ROUTES.RENTER}/`) && renterData?.oneRenterReport) {
      const { firstName, lastName } = renterData.oneRenterReport;
      const renterName = [firstName, lastName].filter(Boolean).join(' ');

      if (!renterName) {
        toast.error('Не вдалося додати орендаря до обраного: відсутнє ім’я');
        return null;
      }

      return {
        id: itemId,
        path: pathname,
        type: 'renter',
        name: renterName,
      };
    }

    return null;
  }, [pathname, houseData, renterData]);

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
