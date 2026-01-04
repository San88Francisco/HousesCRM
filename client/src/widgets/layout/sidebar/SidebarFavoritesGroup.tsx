'use client';

import { useFavoriteStar } from '@/hooks/use-favorite-star';
import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import { BookmarkIcon } from '@/shared/ui/bookmark';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/shared/ui/sidebar';
import { makeTitle } from '@/shared/utils/favorite-start/formate-title';
import { NavItem } from '@/types/model/navigation/navigation';
import { useMemo } from 'react';
import { SidebarMenuItem } from './SidebarMenuItem';

const bookmarkIcon = <BookmarkIcon size={16} />;

export const SidebarFavoritesGroup = () => {
  const favorites = useFavoriteStar();

  const favoriteNavItems: NavItem[] = useMemo(
    () =>
      favorites.map(fav => ({
        title: makeTitle(fav),
        url: fav.path,
        icon: bookmarkIcon,
      })),
    [favorites],
  );

  if (favoriteNavItems.length === 0) return null;

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
