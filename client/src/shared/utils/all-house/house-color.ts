import { PIE_COLORS } from '@/shared/constants/revenue-pie-chart';

export type HouseColorMap = Map<string, string>;

const HASH_MULTIPLIER = 31;

const hashHouseId = (id: string): number => {
  let hash = 0;

  for (const char of id) {
    hash = (hash * HASH_MULTIPLIER + char.charCodeAt(0)) | 0;
  }

  return Math.abs(hash) % PIE_COLORS.length;
};

export const buildHouseColorMap = (houses: { id: string }[]): HouseColorMap =>
  new Map(houses.map(({ id }, index) => [id, PIE_COLORS[index % PIE_COLORS.length]]));

export const getHouseColor = (colorMap: HouseColorMap, id: string): string =>
  colorMap.get(id) ?? PIE_COLORS[hashHouseId(id)];
