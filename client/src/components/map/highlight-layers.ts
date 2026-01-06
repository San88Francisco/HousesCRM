import type { Map } from 'maplibre-gl';
import type { GeoJSONFeatureCollection } from './types';
import { HIGHLIGHT_COLOR } from './constants';

export const ensureHighlightLayers = (map: Map) => {
  if (!map.getSource('highlight-building-geo')) {
    map.addSource('highlight-building-geo', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
  }

  if (!map.getLayer('highlight-building-3d')) {
    map.addLayer({
      id: 'highlight-building-3d',
      type: 'fill-extrusion',
      source: 'highlight-building-geo',
      paint: {
        'fill-extrusion-color': HIGHLIGHT_COLOR,
        'fill-extrusion-opacity': 1.0,
        'fill-extrusion-height': ['+', ['coalesce', ['get', 'height'], 6], 5.0],
        'fill-extrusion-base': ['-', ['coalesce', ['get', 'min_height'], 0], 0.5],
      },
    });
  }

  if (!map.getLayer('highlight-building-fill')) {
    map.addLayer({
      id: 'highlight-building-fill',
      type: 'fill',
      source: 'highlight-building-geo',
      paint: {
        'fill-color': HIGHLIGHT_COLOR,
        'fill-opacity': 1.0,
      },
    });
  }

  if (!map.getLayer('highlight-building-outline')) {
    map.addLayer({
      id: 'highlight-building-outline',
      type: 'line',
      source: 'highlight-building-geo',
      paint: {
        'line-color': HIGHLIGHT_COLOR,
        'line-width': 8,
        'line-opacity': 1,
      },
    });
  }
};

export const clearHighlight = (map: Map) => {
  const src = map.getSource('highlight-building-geo') as maplibregl.GeoJSONSource | undefined;
  if (!src) return;
  src.setData({ type: 'FeatureCollection', features: [] });
};

export const setHighlightFeature = (
  map: Map,
  feature: GeoJSONFeatureCollection['features'][number],
) => {
  const src = map.getSource('highlight-building-geo') as maplibregl.GeoJSONSource | undefined;
  if (!src) return;
  const fc: GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [feature] };
  src.setData(fc);
};
