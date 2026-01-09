'use client';

import {
  formatPaybackCoefficient,
  formatTooltipPrice,
  truncateText,
} from '@/shared/utils/all-house/payback-chart/payback';
import { cn } from '@/shared/utils/cn';
import { PaybackChartData } from '@/types/core/payback-chart';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
}

export const PaybackChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data: PaybackChartData = payload[0].payload;

  const purchaseDate = new Date(data.purchaseDate);
  const formattedDate = !isNaN(purchaseDate.getTime())
    ? purchaseDate.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'short',
      })
    : '—';

  return (
    <div
      className={cn(
        'p-3 rounded-lg border border-border bg-background',
        'min-w-[200px] max-w-[260px]',
      )}
    >
      <p className="font-bold mb-3 text-sm" title={data.apartmentName}>
        {truncateText(data.apartmentName)}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center gap-4">
          <span className="text-xs text-muted">Окупність:</span>
          <span className="text-xs font-bold">
            {formatPaybackCoefficient(data.paybackCoefficient)}
          </span>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-muted">Вартість:</span>
            <span className="text-xs font-medium">{formatTooltipPrice(data.purchasePriceUSD)}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-muted">Заплачено:</span>
            <span className="text-xs font-medium">{formatTooltipPrice(data.totalIncomeUSD)}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-muted">Дата:</span>
            <span className="text-xs text-muted">{formattedDate}</span>
          </div>
        </div>

        {data.isFullyPaidBack && (
          <>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-end pt-1">
              <span className="text-xs font-semibold text-[var(--positive)]">Окуплена</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
