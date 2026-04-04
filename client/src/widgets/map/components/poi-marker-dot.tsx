'use client';

import { POI_VISUAL } from '../constants';
import type { POICategory } from '../types';

export function PoiMarkerDot({ category }: { category: POICategory }) {
  const { color } = POI_VISUAL[category];
  return (
    <div
      className="h-3 w-3 cursor-pointer rounded-full border-2 border-white shadow-md transition-transform hover:scale-125"
      style={{ backgroundColor: color }}
    />
  );
}
