import maplibregl, { type Map } from 'maplibre-gl';
import { RIVNE_CENTER, RIVNE_REGION_BOUNDS } from './constants';

export const createMapStyle = (isDark: boolean) => {
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  if (maptilerKey) {
    return `https://api.maptiler.com/maps/${isDark ? 'streets-v2-dark' : 'streets-v2'}/style.json?key=${maptilerKey}`;
  }

  return {
    version: 8 as const,
    sources: {
      'raster-tiles': {
        type: 'raster' as const,
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
      openmaptiles: {
        type: 'vector' as const,
        tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'],
        minzoom: 0,
        maxzoom: 14,
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background' as const,
        paint: {
          'background-color': isDark ? '#0b0b0b' : '#f3f4f6',
        },
      },
      {
        id: 'simple-tiles',
        type: 'raster' as const,
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
        paint: isDark
          ? {
              'raster-brightness-min': 0.3,
              'raster-brightness-max': 0.7,
              'raster-contrast': 0.8,
              'raster-saturation': 0.5,
            }
          : {},
      },
    ],
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  };
};

export const initializeMap = (
  container: HTMLDivElement,
  isDark: boolean,
): { map: Map; cleanup: () => void } => {
  const mapStyle = createMapStyle(isDark);

  const map = new maplibregl.Map({
    container,
    style: mapStyle,
    center: RIVNE_CENTER,
    zoom: 13,
    pitch: 60,
    bearing: -20,
    maxBounds: RIVNE_REGION_BOUNDS,
    minZoom: 10,
    maxZoom: 19,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');
  map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

  const cleanup = () => {
    map.remove();
  };

  return { map, cleanup };
};
