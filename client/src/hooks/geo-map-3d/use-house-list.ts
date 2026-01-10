import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import { useMemo } from 'react';

export const useHouseList = (
  houses: HouseCoordinates[],
  geocodedHouses: HouseCoordinates[],
  searchResult: HouseCoordinates | null,
) => {
  return useMemo(() => {
    const housesWithCoords = houses.map(house => {
      const geocoded = geocodedHouses.find(g => g.id === house.id);
      return geocoded || house;
    });

    const allHouses =
      searchResult && (searchResult.lng !== 0 || searchResult.lat !== 0)
        ? [...housesWithCoords, searchResult]
        : housesWithCoords;

    return allHouses;
  }, [houses, geocodedHouses, searchResult]);
};
