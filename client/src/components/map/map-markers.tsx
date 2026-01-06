import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import maplibregl, { type Map, type Marker } from 'maplibre-gl';
import { RefObject } from 'react';
import { HIGHLIGHT_COLOR, HIGHLIGHT_ZOOM } from './constants';
import { clearHighlight, ensureHighlightLayers, setHighlightFeature } from './highlight-layers';
import { pickBuildingAtPoint } from './pick-building';

export const createHouseMarkers = (
  map: Map,
  houses: HouseCoordinates[],
  isDark: boolean,
  highlightedHouseIdRef: RefObject<string | null>,
): Marker[] & { tooltips: HTMLDivElement[] } => {
  const markers: Marker[] = [];
  const tooltips: HTMLDivElement[] = [];

  houses.forEach(house => {
    const el = document.createElement('div');
    el.className = 'house-marker';
    el.setAttribute('data-house-id', house.id);
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = HIGHLIGHT_COLOR;
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    el.style.transition = 'box-shadow 0.2s ease, border-width 0.2s ease';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.boxSizing = 'border-box';
    el.style.display = 'block';

    const textColor = isDark ? '#ffffff' : '#111827';
    const mutedColor = isDark ? '#7e7e7e' : '#6b7280';

    const tooltip = document.createElement('div');
    tooltip.className = `tooltip-${house.id}`;
    tooltip.setAttribute('data-house-id', house.id);
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '8px 14px';
    tooltip.style.background = isDark ? 'rgba(15, 15, 15, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    tooltip.style.backdropFilter = 'blur(10px)';
    tooltip.style.color = textColor;
    tooltip.style.border = `1px solid ${isDark ? 'rgba(255, 107, 53, 0.3)' : 'rgba(255, 107, 53, 0.2)'}`;
    tooltip.style.borderRadius = '8px';
    tooltip.style.fontSize = '13px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.boxShadow = `0 8px 16px -4px rgba(0, 0, 0, ${isDark ? '0.4' : '0.15'}), 0 0 0 1px ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`;
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.style.transition =
      'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), visibility 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)';
    tooltip.style.zIndex = '9999';
    tooltip.innerHTML = `
      <div style="font-weight: 600; font-size: 13px; color: ${textColor}; line-height: 1.4;">${house.apartmentName}</div>
      <div style="font-size: 11px; color: ${mutedColor}; margin-top: 3px; line-height: 1.3;">${house.street}</div>
    `;

    map.getContainer().appendChild(tooltip);
    tooltips.push(tooltip);

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([house.lng, house.lat])
      .addTo(map);

    const updateTooltipPosition = () => {
      const markerElement = el;
      const markerRect = markerElement.getBoundingClientRect();
      const mapContainer = map.getContainer();
      const mapRect = mapContainer.getBoundingClientRect();

      tooltip.style.left = `${markerRect.left - mapRect.left + markerRect.width / 2}px`;
      tooltip.style.top = `${markerRect.top - mapRect.top - 10}px`;
      tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    };

    const moveHandler = () => {
      if (tooltip.style.visibility === 'visible') {
        updateTooltipPosition();
      }
    };
    map.on('move', moveHandler);
    map.on('zoom', moveHandler);

    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.6)';
      el.style.borderWidth = '3px';
      updateTooltipPosition();
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateX(-50%) translateY(-100%) translateY(-4px)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.borderWidth = '2px';
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
      tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    });

    el.addEventListener('click', e => {
      e.stopPropagation();

      if (highlightedHouseIdRef.current === house.id) {
        clearHighlight(map);
        highlightedHouseIdRef.current = null;
        return;
      }

      const currentZoom = map.getZoom();

      if (currentZoom < 16) {
        map.flyTo({
          center: [house.lng, house.lat],
          zoom: HIGHLIGHT_ZOOM,
          pitch: 60,
          bearing: -20,
          duration: 1500,
          essential: true,
        });

        map.once('idle', () => {
          const picked = pickBuildingAtPoint(map, house.lng, house.lat);
          if (picked) {
            ensureHighlightLayers(map);
            setHighlightFeature(map, picked);
            highlightedHouseIdRef.current = house.id;
          }
        });
      } else {
        const picked = pickBuildingAtPoint(map, house.lng, house.lat);
        if (picked) {
          ensureHighlightLayers(map);
          setHighlightFeature(map, picked);
          highlightedHouseIdRef.current = house.id;
        }
      }
    });

    markers.push(marker);
  });

  return Object.assign(markers, { tooltips });
};
