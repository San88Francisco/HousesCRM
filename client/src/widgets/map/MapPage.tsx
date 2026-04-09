'use client';

import { MapToolbar } from './components/map-toolbar';
import { MapView } from './components/map-view';
import { useMapPageController } from './hooks/useMapPageController';

export function MapPage() {
  const ctrl = useMapPageController();

  return (
    <div className="flex h-full flex-col gap-4">
      <MapToolbar
        geocoded={ctrl.geocoded}
        pendingCount={ctrl.pendingCount}
        infraScope={ctrl.infraScope}
        infraStatusLabel={ctrl.infraStatusLabel}
        searchQuery={ctrl.searchQuery}
        onSearchQueryChange={ctrl.setSearchQuery}
        searchResult={ctrl.searchResult}
        searchError={ctrl.searchError}
        isSearching={ctrl.isSearching}
        poisLoading={ctrl.poisLoading}
        poisError={ctrl.poisError}
        poisCount={ctrl.pois.length}
        poiCategories={ctrl.poiCategories}
        onSearch={ctrl.handleSearch}
        onClearSearch={ctrl.clearSearch}
        onGoMergedAll={ctrl.goMergedAll}
      />
      <MapView
        mapRef={ctrl.mapRef}
        housesLoading={ctrl.housesLoading}
        geocoded={ctrl.geocoded}
        infraScope={ctrl.infraScope}
        singleHouseId={ctrl.singleHouseId}
        searchResult={ctrl.searchResult}
        pois={ctrl.pois}
        poisLoading={ctrl.poisLoading}
        onShowOnlyHouse={ctrl.showOnlyThisHouse}
        onRefreshHouseInfra={ctrl.refreshInfraForHouse}
        onRefreshSearchInfra={ctrl.refreshSearchInfra}
        onGoMergedAll={ctrl.goMergedAll}
      />
    </div>
  );
}
