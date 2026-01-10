import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import { geocodeAddress } from '@/utils/geo-map-3d/geocoding';
import { useEffect, useState } from 'react';

export const useGeocoding = (mockHouse: HouseCoordinates) => {
  const [geocodedHouses, setGeocodedHouses] = useState<HouseCoordinates[]>([]);
  const [isGeocodingInitial, setIsGeocodingInitial] = useState(false);

  useEffect(() => {
    const geocodeHousesWithoutCoords = async () => {
      const needsGeocoding = mockHouse.lng === 0 || mockHouse.lat === 0;
      if (!needsGeocoding || isGeocodingInitial) return;

      setIsGeocodingInitial(true);

      try {
        const result = await geocodeAddress(mockHouse.street, '');

        if (result) {
          const geocodedHouse: HouseCoordinates = {
            ...mockHouse,
            lng: result.lng,
            lat: result.lat,
          };
          setGeocodedHouses([geocodedHouse]);
        } else {
          setGeocodedHouses([mockHouse]);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setGeocodedHouses([mockHouse]);
      }
    };

    geocodeHousesWithoutCoords();
  }, [isGeocodingInitial, mockHouse]);

  return { geocodedHouses, isGeocodingInitial };
};
