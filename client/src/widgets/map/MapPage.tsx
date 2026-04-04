'use client';

import { MapToolbar } from './components/map-toolbar';
import { MapView } from './components/map-view';
import { useMapPageController } from './hooks/useMapPageController';

export function MapPage() {
  const c = useMapPageController();

  return (
    <div className="flex h-full flex-col gap-4">
      <MapToolbar
        geocoded={c.geocoded}
        pendingCount={c.pendingCount}
        infraScope={c.infraScope}
        infraStatusLabel={c.infraStatusLabel}
        searchQuery={c.searchQuery}
        onSearchQueryChange={c.setSearchQuery}
        searchResult={c.searchResult}
        searchError={c.searchError}
        isSearching={c.isSearching}
        poisLoading={c.poisLoading}
        poisError={c.poisError}
        poisCount={c.pois.length}
        poiCategories={c.poiCategories}
        onSearch={c.handleSearch}
        onClearSearch={c.clearSearch}
        onGoMergedAll={c.goMergedAll}
      />
      <MapView
        mapRef={c.mapRef}
        housesLoading={c.housesLoading}
        geocoded={c.geocoded}
        infraScope={c.infraScope}
        singleHouseId={c.singleHouseId}
        searchResult={c.searchResult}
        pois={c.pois}
        poisLoading={c.poisLoading}
        onShowOnlyHouse={c.showOnlyThisHouse}
        onRefreshHouseInfra={c.refreshInfraForHouse}
        onRefreshSearchInfra={c.refreshSearchInfra}
        onGoMergedAll={c.goMergedAll}
      />
    </div>
  );
}
