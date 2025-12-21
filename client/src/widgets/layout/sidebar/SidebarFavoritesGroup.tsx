'use client';

import { useMemo } from 'react';
import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenu,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/shared/ui/sidebar';
import { SidebarMenuItem } from './SidebarMenuItem';
import { NavItem } from '@/types/navigation';
import { BookmarkIcon } from '@/shared/ui/bookmark';
import { useFavoriteStart } from '@/hooks/use-favorite-star';
import { makeTitle } from '@/shared/utils/favorite-start/formate-title';

const bookmarkIcon = <BookmarkIcon size={16} />;

export const SidebarFavoritesGroup = () => {
  const favorites = useFavoriteStart();

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
