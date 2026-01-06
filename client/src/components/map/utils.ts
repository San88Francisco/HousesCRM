import type { Map } from 'maplibre-gl';
import type { GeoJSONFeatureCollection } from './types';
import { RIVNE_REGION_BOUNDS } from './constants';

export const closeRing = (ring: number[][]) => {
  if (!ring?.length) return ring;
  const a = ring[0];
  const b = ring[ring.length - 1];
  return a[0] === b[0] && a[1] === b[1] ? ring : [...ring, a];
};

export const approximatePixelArea = (map: Map, ring: number[][]) => {
  const pts = ring.map(([lng, lat]) => map.project([lng, lat]));
  let area = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    area += pts[i].x * pts[i + 1].y - pts[i + 1].x * pts[i].y;
  }
  return Math.abs(area / 2);
};

export const createRegionMask = (): GeoJSONFeatureCollection => {
  const [sw, ne] = RIVNE_REGION_BOUNDS;
  const [swLng, swLat] = sw;
  const [neLng, neLat] = ne;

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
              [-180, -90],
            ],
            [
              [swLng, swLat],
              [neLng, swLat],
              [neLng, neLat],
              [swLng, neLat],
              [swLng, swLat],
            ],
          ],
        },
      },
    ],
  };
};
