import { useLazyGeocodeAddressQuery } from '@/store/api/houses-api';
import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import { useRef, useState } from 'react';

export const useAddressSearch = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<HouseCoordinates | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [geocodeAddress] = useLazyGeocodeAddressQuery();

  const mapActionsRef = useRef<{
    highlightHouse: (houseId: string, lng: number, lat: number) => void;
    highlightAndFlyToHouse: (houseId: string, lng: number, lat: number) => void;
    clearHighlight: () => void;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      setSearchError('Введіть адресу для пошуку');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const result = await geocodeAddress({ address: searchAddress, city: 'Рівне' }).unwrap();

      if (result) {
        const newSearchResult: HouseCoordinates = {
          id: `search-${Date.now()}`,
          lng: result.lng,
          lat: result.lat,
          apartmentName: 'Знайдена адреса',
          street: result.displayName,
        };
        setSearchResult(newSearchResult);

        if (mapActionsRef.current) {
          mapActionsRef.current.highlightAndFlyToHouse(newSearchResult.id, result.lng, result.lat);
        }
      } else {
        setSearchError('Адресу не знайдено. Спробуйте іншу адресу.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Помилка при пошуку адреси. Спробуйте пізніше.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchAddress('');
    if (mapActionsRef.current) {
      mapActionsRef.current.clearHighlight();
    }
  };

  return {
    searchAddress,
    setSearchAddress,
    isSearching,
    searchResult,
    searchError,
    setSearchError,
    setSearchResult,
    mapActionsRef,
    handleSearch,
    clearSearch,
  };
};
