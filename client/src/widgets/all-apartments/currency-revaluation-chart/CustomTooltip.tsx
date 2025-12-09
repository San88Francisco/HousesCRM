import React from 'react';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';
import { cn } from '@/shared/utils/cn';
import {
  formatRate,
  formatCurrency,
  truncateText,
  TOOLTIP_Z_INDEX,
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
    <span className="text-xs text-[var(--muted-text)]">{label}</span>
    <span className="text-xs text-[var(--text)]">{value}</span>
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
      <span className="text-xs text-[var(--muted-text)]">{title}</span>
      <span className="font-semibold text-xs text-[var(--text)]">{formatCurrency(amount)}</span>
    </div>
    <TooltipRow label={rateLabel} value={formatRate(rate)} />
  </div>
);

type Props = {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  isDark: boolean;
  coordinate?: { x: number; y: number };
};

const getTooltipClasses = (isDark: boolean): string => {
  const bgColor = isDark ? 'bg-[var(--dark)]' : 'bg-[var(--white)]';

  return cn(
    'p-3 rounded-lg shadow-2xl border min-w-[220px] max-w-[280px] relative',
    'border-[var(--border)]',
    `z-[${TOOLTIP_Z_INDEX}]`,
    bgColor,
  );
};

export const CustomTooltip = ({ active, payload, isDark, coordinate }: Props) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  const classes = getTooltipClasses(isDark);

  const shouldShowAbove = coordinate?.y > TOOLTIP_BOUNDARY_Y;
  const transformStyle: React.CSSProperties = {
    transform: shouldShowAbove ? 'translateY(-100%)' : `translateY(${TOOLTIP_OFFSET_Y}px)`,
  };

  return (
    <div className={classes} style={transformStyle}>
      <p className="font-bold mb-3 text-sm text-[var(--text)]" title={data.apartmentName}>
        {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
      </p>

      <div className="space-y-2">
        <TooltipSection
          title="Початкова:"
          amount={data.purchaseAmount}
          rate={data.purchaseRate}
          rateLabel="Курс купівлі:"
        />

        <div className="h-px bg-[var(--border)]" />

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
