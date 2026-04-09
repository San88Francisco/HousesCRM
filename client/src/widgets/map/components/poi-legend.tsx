'use client';

import { CATEGORY_PRIORITY, POI_VISUAL } from '../constants';
import type { POICategory } from '../types';

export function PoiLegend({ categories }: { categories: POICategory[] }) {
  if (!categories.length) return null;

  const unique = [...new Set(categories)].sort(
    (a, b) => CATEGORY_PRIORITY.indexOf(a) - CATEGORY_PRIORITY.indexOf(b),
  );

  return (
    <div className="flex flex-wrap gap-1.5">
      {unique.map(cat => {
        const { label, color, Icon } = POI_VISUAL[cat];
        return (
          <span key={cat} className="flex items-center gap-1 text-sm text-muted">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full border border-white/50"
              style={{ backgroundColor: color }}
            />
            <Icon size={14} />
            {label}
          </span>
        );
      })}
    </div>
  );
}
