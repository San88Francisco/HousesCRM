import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import type { Map, MapGeoJSONFeature } from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { MIN_ZOOM_FOR_BUILDINGS } from './constants';
import type { BuildingFeatureProperties } from './types';
import { approximatePixelArea, closeRing } from './utils';

type Candidate = {
  feature: MapGeoJSONFeature;
  ring: number[][];
  props: BuildingFeatureProperties & { height: number; min_height: number };
  areaPx: number;
  distance: number;
};

const extractRingsFromGeometry = (geometry: MapGeoJSONFeature['geometry']): number[][][] => {
  if (!geometry) return [];

  if (geometry.type === 'Polygon') {
    return [geometry.coordinates[0]];
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.filter(poly => poly?.[0]?.length).map(poly => poly[0]);
  }

  return [];
};

const calculateRingCenter = (ring: number[][]): [number, number] => {
  const sum = ring.reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
  return [sum[0] / ring.length, sum[1] / ring.length];
};

const calculateDistance = (center: [number, number], target: [number, number]): number => {
  return Math.sqrt(Math.pow(center[0] - target[0], 2) + Math.pow(center[1] - target[1], 2));
};

const processRing = (
  rawRing: number[][],
  feature: MapGeoJSONFeature,
  map: Map,
  targetLng: number,
  targetLat: number,
): Candidate | null => {
  try {
    const ring = closeRing(rawRing as number[][]);
    if (ring.length < 3) return null;

    const props = feature.properties || {};
    const height = props.height ?? props.render_height ?? 6;
    const min_height = props.min_height ?? props.render_min_height ?? 0;
    const areaPx = approximatePixelArea(map, ring);
    const [centerLng, centerLat] = calculateRingCenter(ring);
    const distance = calculateDistance([centerLng, centerLat], [targetLng, targetLat]);

    return {
      feature,
      ring,
      props: { ...props, height, min_height },
      areaPx,
      distance,
    };
  } catch (e) {
    console.error('Error processing building polygon:', e);
    return null;
  }
};

const findBestCandidate = (
  candidates: Candidate[],
  targetPoint: ReturnType<typeof point>,
): Candidate | null => {
  if (!candidates.length) return null;

  const insideCandidates = candidates
    .map(candidate => {
      try {
        const isInside = booleanPointInPolygon(targetPoint, polygon([candidate.ring]));
        return isInside ? candidate : null;
      } catch {
        return null;
      }
    })
    .filter((c): c is Candidate => c !== null);

  if (insideCandidates.length > 0) {
    return [...insideCandidates].sort((a, b) => a.areaPx - b.areaPx)[0];
  }

  return [...candidates].sort((a, b) => a.distance - b.distance)[0];
};

export const pickBuildingAtPoint = (map: Map, lng: number, lat: number) => {
  if (!map.getLayer('3d-buildings')) return null;

  const currentZoom = map.getZoom();
  if (currentZoom < MIN_ZOOM_FOR_BUILDINGS) return null;

  const p = map.project([lng, lat]);
  const pad = 80;
  const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
    [p.x - pad, p.y - pad],
    [p.x + pad, p.y + pad],
  ];

  const has3d = !!map.getLayer('3d-buildings');
  const rendered = has3d
    ? map.queryRenderedFeatures(bbox, { layers: ['3d-buildings'] })
    : map.queryRenderedFeatures(bbox);

  const candidates = rendered.flatMap(feature => {
    const rings = extractRingsFromGeometry(feature.geometry);
    return rings
      .map(rawRing => processRing(rawRing, feature, map, lng, lat))
      .filter((c): c is Candidate => c !== null);
  });

  const targetPoint = point([lng, lat]);
  const best = findBestCandidate(candidates, targetPoint);

  if (!best) return null;

  return {
    id: best.feature.id,
    type: 'Feature' as const,
    properties: best.props,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [best.ring],
    },
  };
};
