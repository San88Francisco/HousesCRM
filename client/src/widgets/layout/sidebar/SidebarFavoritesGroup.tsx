'use client';

import { useFavoriteStar } from '@/hooks';
import { SIDEBAR_STYLES } from '@/shared/constants/styles/sidebar';
import { BookmarkIcon } from '@/shared/ui/bookmark';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from '@/shared/ui/sidebar';
import { makeTitle } from '@/shared/utils/favorite-start';
import { NavItem } from '@/types/model/navigation';
import { useMemo } from 'react';
import { SidebarMenuItem } from './SidebarMenuItem';

export const SidebarFavoritesGroup = () => {
  const favorites = useFavoriteStar();
  const { state } = useSidebar();

  const favoriteNavItems: NavItem[] = useMemo(
    () =>
      favorites.map(fav => ({
        title: makeTitle(fav),
        url: fav.path,
        icon: <BookmarkIcon size={16} />,
      })),
    [favorites],
  );

  if (favoriteNavItems.length === 0 || state === 'collapsed') return null;

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
