'use client';

import { GeoMap3D } from '@/components/map/rivne-3d-map';

import { useGetHousesForMapQuery } from '@/store/api/houses-api';
import { useAddressSearch } from '../../src/hooks/geo-map-3d/use-address-search';
import { useGeocodeHouses } from '../../src/hooks/geo-map-3d/use-geocode-houses';
import { useHouseList } from '../../src/hooks/geo-map-3d/use-house-list';
import { MapStats } from '../../src/widgets/geo-map-3d/MapStats';
import { SearchBar } from '../../src/widgets/geo-map-3d/SearchBar';

export default function Page() {
  const { data: houses = [], isLoading } = useGetHousesForMapQuery();
  const geocodedHouses = useGeocodeHouses(houses);

  const {
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
  } = useAddressSearch();

  const allHouses = useHouseList(houses, geocodedHouses, searchResult);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">3D Карта нерухомості Рівне</h1>

        <SearchBar
          searchAddress={searchAddress}
          setSearchAddress={setSearchAddress}
          isSearching={isSearching}
          searchError={searchError}
          searchResult={searchResult}
          setSearchError={setSearchError}
          setSearchResult={setSearchResult}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />

        <MapStats isLoading={isLoading} housesCount={allHouses.length} />
      </div>

      <GeoMap3D houses={allHouses} actionsRef={mapActionsRef} />
    </div>
  );
}
