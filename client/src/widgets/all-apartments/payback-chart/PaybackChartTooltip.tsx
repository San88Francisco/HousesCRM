'use client';

import React, { CSSProperties } from 'react';
import { PaybackChartData } from '@/types/core/payback-chart/analytics';
import { formatPaybackCoefficient } from '@/shared/utils/all-apartments/payback-chart/payback';
import { cn } from '@/shared/utils/cn';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
  coordinate?: { x: number; y: number };
}

const MAX_NAME_LENGTH = 20;
const TOOLTIP_BOUNDARY_Y = 180;
const TOOLTIP_OFFSET_Y = 10;
const PRICE_DIVIDER = 1000;
const DECIMAL_PLACES = 0;

const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string => {
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

type TooltipRowProps = {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  valueStyle?: CSSProperties;
};

const TooltipRow = ({ label, value, valueClassName, valueStyle }: TooltipRowProps) => (
  <div className="flex justify-between gap-4 items-center">
    <span className="text-xs text-muted">{label}</span>
    <span className={cn('text-xs font-medium', valueClassName)} style={valueStyle}>
      {value}
    </span>
  </div>
);

export const PaybackChartTooltip = ({ active, payload, coordinate }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data: PaybackChartData = payload[0].payload;

  const shouldShowAbove = coordinate && coordinate.y > TOOLTIP_BOUNDARY_Y;
  const transformStyle: CSSProperties = {
    transform: shouldShowAbove ? 'translateY(-100%)' : `translateY(${TOOLTIP_OFFSET_Y}px)`,
  };

  const formattedPrice = (data.purchasePriceUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES);
  const formattedIncome = (data.totalIncomeUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES);
  const formattedDate = new Date(data.purchaseDate).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <div
      className="p-3 rounded-lg border min-w-[200px] max-w-[260px] relative border-border z-[9999] bg-background"
      style={transformStyle}
    >
      <p className="font-bold mb-3 text-sm" title={data.apartmentName}>
        {truncateText(data.apartmentName)}
      </p>

      <div className="space-y-2">
        <TooltipRow
          label="Окупність:"
          value={formatPaybackCoefficient(data.paybackCoefficient)}
          valueClassName="font-bold"
          valueStyle={{ color: data.color }}
        />

        <div className="h-px bg-border" />

        <TooltipRow label="Вартість:" value={`$${formattedPrice}k`} />
        <TooltipRow label="Заплачено:" value={`$${formattedIncome}k`} />
        <TooltipRow label="Дата:" value={formattedDate} />

        {data.isFullyPaidBack && (
          <>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: data.color }}
              />
              <span className="font-semibold text-xs" style={{ color: data.color }}>
                Окуплена
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
