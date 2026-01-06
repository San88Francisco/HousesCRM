import { useLazyGeocodeAddressQuery } from '@/store/houses-api';
import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import { useEffect, useState } from 'react';

export const useGeocodeHouses = (houses: HouseCoordinates[]) => {
  const [geocodeAddress] = useLazyGeocodeAddressQuery();
  const [geocodedHouses, setGeocodedHouses] = useState<HouseCoordinates[]>([]);

  useEffect(() => {
    const geocodeHousesWithoutCoords = async () => {
      const housesToGeocode = houses.filter(
        house => house.lng === 0 && house.lat === 0 && house.street,
      );

      if (housesToGeocode.length === 0) {
        setGeocodedHouses([]);
        return;
      }

      const geocoded: HouseCoordinates[] = [];

      for (const house of housesToGeocode) {
        try {
          const result = await geocodeAddress({ address: house.street, city: 'Рівне' }).unwrap();
          if (result) {
            geocoded.push({
              ...house,
              lng: result.lng,
              lat: result.lat,
            });
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Geocoding error for ${house.street}:`, error);

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setGeocodedHouses(geocoded);
    };

    geocodeHousesWithoutCoords();
  }, [houses, geocodeAddress]);

  return geocodedHouses;
};
