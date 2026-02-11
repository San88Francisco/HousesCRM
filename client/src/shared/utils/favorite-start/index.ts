import { FavoriteItem } from '../storage';

export const makeTitle = (fav: FavoriteItem) => {
  if (fav.name.length <= 30) return fav.name;
  return `${fav.name.slice(0, 30).trimEnd()}…`;
};
