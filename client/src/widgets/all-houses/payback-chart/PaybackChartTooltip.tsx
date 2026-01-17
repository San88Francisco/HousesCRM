'use client';

import {
  formatPaybackCoefficient,
  formatTooltipPrice,
} from '@/shared/utils/all-house/payback-chart/payback';
import { cn } from '@/shared/utils/cn';
import { truncateText } from '@/shared/utils/text';
import { PaybackChartData } from '@/types/core/payback-chart';

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
};

const DEFAULT_LOCALE = 'uk-UA';

export const PaybackChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data: PaybackChartData = payload[0].payload;

  if (data.isEmpty || !data.id || data.purchasePriceUSD === 0) {
    return null;
  }

  const currentCurrency = data.currencyCode;

  const purchaseDate = (() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.purchaseDate);
    if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    return new Date(data.purchaseDate);
  })();
  const formattedDate = !isNaN(purchaseDate.getTime())
    ? purchaseDate.toLocaleDateString(DEFAULT_LOCALE, {
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
            <span className="text-xs font-medium">
              {formatTooltipPrice(data.purchasePriceUSD, currentCurrency)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-muted">Дохід:</span>
            <span className="text-xs font-medium">
              {formatTooltipPrice(data.totalIncomeUSD, currentCurrency)}
            </span>
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
