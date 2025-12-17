'use client';

import { PaybackChartData } from '@/types/core/payback-chart/analytics';
import { formatPaybackCoefficient } from '@/shared/utils/all-apartments/payback-chart/payback';
import { cn } from '@/shared/utils/cn';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
}

const MAX_NAME_LENGTH = 16;
const PRICE_DIVIDER = 1000;
const DECIMAL_PLACES = 0;

const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string => {
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

export const PaybackChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data: PaybackChartData = payload[0].payload;

  return (
    <div
      className={cn(
        'p-3 md:p-4 rounded-xl shadow-2xl border-2 min-w-[180px] max-w-[220px]  bg-background',
      )}
      style={{
        borderColor: data.color,
      }}
    >
      <div className="mb-2 pb-2 border-b" style={{ borderColor: `${data.color}30` }}>
        <p
          className="font-bold text-sm sm:text-base"
          style={{ color: data.color }}
          title={data.apartmentName}
        >
          {truncateText(data.apartmentName)}
        </p>
      </div>

      <div className="space-y-1.5 text-xs sm:text-sm ">
        <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
          <span>Окупність</span>
          <span className="font-bold" style={{ color: data.color }}>
            {formatPaybackCoefficient(data.paybackCoefficient)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span>Вартість</span>
          <span className="font-semibold">
            ${(data.purchasePriceUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES)}k
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span>Заплачено</span>
          <span className="font-semibold">
            ${(data.totalIncomeUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES)}k
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span>Дата</span>
          <span className="text-xs text-muted">
            {new Date(data.purchaseDate).toLocaleDateString('uk-UA', {
              year: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {data.isFullyPaidBack && (
        <div
          className="mt-2 pt-2 border-t flex items-center gap-1.5"
          style={{ borderColor: `${data.color}30` }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-xs" style={{ color: data.color }}>
            Окуплена
          </span>
        </div>
      )}
    </div>
  );
};
