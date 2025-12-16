import React, { CSSProperties } from 'react';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';

import {
  formatRate,
  formatCurrency,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';

const MAX_NAME_LENGTH = 20;
const TOOLTIP_BOUNDARY_Y = 180;
const TOOLTIP_OFFSET_Y = 10;

type TooltipRowProps = {
  label: string;
  value: string;
};

const TooltipRow = ({ label, value }: TooltipRowProps) => (
  <div className="flex justify-between gap-4">
    <span className="text-xs text-muted">{label}</span>
    <span className="text-xs">{value}</span>
  </div>
);

type TooltipSectionProps = {
  title: string;
  amount: number;
  rate: number;
  rateLabel: string;
};

const TooltipSection = ({ title, amount, rate, rateLabel }: TooltipSectionProps) => (
  <div>
    <div className="flex justify-between gap-4 mb-1">
      <span className="text-xs text-muted">{title}</span>
      <span className="font-semibold text-xs ">{formatCurrency(amount)}</span>
    </div>
    <TooltipRow label={rateLabel} value={formatRate(rate)} />
  </div>
);

type Props = {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  coordinate?: { x: number; y: number };
};

export const CurrencyRevaluationTooltip = ({ active, payload, coordinate }: Props) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  const shouldShowAbove = coordinate && coordinate.y > TOOLTIP_BOUNDARY_Y;
  const transformStyle: CSSProperties = {
    transform: shouldShowAbove ? 'translateY(-100%)' : `translateY(${TOOLTIP_OFFSET_Y}px)`,
  };

  return (
    <div
      className="p-3 rounded-lg shadow-2xl border min-w-[220px] max-w-[280px] relative border-border z-[9999] bg-background"
      style={transformStyle}
    >
      <p className="font-bold mb-3 text-sm " title={data.apartmentName}>
        {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
      </p>

      <div className="space-y-2">
        <TooltipSection
          title="Початкова:"
          amount={data.purchaseAmount}
          rate={data.purchaseRate}
          rateLabel="Курс купівлі:"
        />

        <div className="h-px bg-border" />

        <TooltipSection
          title="Поточна:"
          amount={data.revaluationAmount}
          rate={data.currentRate}
          rateLabel="Поточний курс:"
        />
      </div>
    </div>
  );
};
