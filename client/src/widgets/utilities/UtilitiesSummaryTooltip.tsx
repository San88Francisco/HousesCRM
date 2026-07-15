'use client';

import { UTILITY_CONFIG } from '@/shared/constants/utilities';
import { formatMonthFull } from '@/shared/utils/meters/format-month';
import { UtilitySummaryMonth, UtilityType } from '@/types/services/meters';

type TooltipPayloadItem = {
  payload?: UtilitySummaryMonth & Record<string, unknown>;
};

type Props = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
};

const formatAmount = (amount: number) =>
  `${amount.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} грн`;

export const UtilitiesSummaryTooltip = ({ active, payload }: Props) => {
  if (!active || !payload || payload.length === 0) return null;

  const monthData = payload[0]?.payload;
  if (!monthData) return null;

  const rows = Object.values(UtilityType)
    .map(type => ({ config: UTILITY_CONFIG[type], cost: monthData.costs?.[type] }))
    .filter((row): row is { config: (typeof row)['config']; cost: number } => Boolean(row.cost));

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-2xl pointer-events-none max-w-[260px] text-sm">
      <div className="font-semibold mb-2 border-b border-border pb-2">
        {formatMonthFull(monthData.month)}
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {rows.map(({ config, cost }) => (
          <div key={config.type} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: config.chartColor }}
              />
              {config.label}
            </span>
            <span className="font-medium">{formatAmount(cost)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mt-2 border-t border-border pt-2 font-bold">
        <span>Разом</span>
        <span>{formatAmount(monthData.total)}</span>
      </div>
    </div>
  );
};
