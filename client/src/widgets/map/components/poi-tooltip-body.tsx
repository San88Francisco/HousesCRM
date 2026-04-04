'use client';

import { POI_VISUAL } from '../constants';
import { isGenericOtherPoiName } from '../utils/poi-generic-name';
import type { POI } from '../types';

export function PoiTooltipBody({ poi }: { poi: POI }) {
  const { Icon, color, label } = POI_VISUAL[poi.category];
  const hideTitle = isGenericOtherPoiName(poi);

  return (
    <div className="min-w-[150px] max-w-[260px] space-y-1 text-left">
      <div className="flex items-center gap-1.5">
        <Icon size={13} style={{ color }} />
        <span className="text-xs font-medium text-muted">{label}</span>
      </div>
      {!hideTitle ? (
        <p className="text-sm font-medium leading-tight text-text">{poi.name}</p>
      ) : null}
      {poi.tags.opening_hours ? (
        <p className="text-xs text-muted">{poi.tags.opening_hours}</p>
      ) : null}
    </div>
  );
}
