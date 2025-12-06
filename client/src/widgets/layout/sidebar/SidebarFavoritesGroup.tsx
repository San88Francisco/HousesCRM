'use client';

import { useEffect, useState } from 'react';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/sidebar';
import { SidebarMenuItem } from './SidebarMenuItem';
import { FavoriteItem, getFavoriteItems } from '@/shared/utils/storage/favorites-storage';
import { NavItem } from '@/types/navigation';
import { BookmarkIcon } from '@/shared/ui/bookmark';

export const SidebarFavoritesGroup = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const items = getFavoriteItems();
    setFavorites(items);
  }, []);

  if (!favorites.length) return null;

  const favoriteNavItems: NavItem[] = favorites.map(fav => ({
    title:
      fav.type === 'apartment'
        ? `Квартира ${fav.id.slice(0, 6)}...`
        : `${fav.type} ${fav.id.slice(0, 6)}...`,
    url: fav.path,
    icon: <BookmarkIcon size={16} />,
  }));

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.base}>
      <SidebarGroupLabel>Улюблені</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className={SIDEBAR_STYLES.sidebarGroup.menu}>
          {favoriteNavItems.map(item => (
            <SidebarMenuItem key={item.url} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
