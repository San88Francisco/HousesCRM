import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';
import { CSSProperties } from 'react';

import {
  formatCurrency,
  formatRate,
  truncateText,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';

const MAX_NAME_LENGTH = 20;
const TOOLTIP_BOUNDARY_Y = 180;
const TOOLTIP_OFFSET_Y = 10;
const TOOLTIP_HALF_WIDTH = 90;

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
      <span className="font-semibold text-xs">{formatCurrency(amount)}</span>
    </div>
    <TooltipRow label={rateLabel} value={formatRate(rate)} />
  </div>
);

type Props = {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  coordinate?: { x: number; y: number };
  viewBox?: { width: number; height: number; x?: number; y?: number };
};

export const CurrencyRevaluationTooltip = ({ active, payload, coordinate, viewBox }: Props) => {
  if (!active || !payload?.length || !coordinate || !viewBox) {
    return null;
  }

  const data = payload[0].payload;
  const containerLeft = viewBox.x || 0;
  const containerWidth = viewBox.width;
  const maxLeft = containerLeft + containerWidth - TOOLTIP_HALF_WIDTH;
  const safeLeft = Math.min(coordinate.x, maxLeft);

  const shouldShowAbove = coordinate.y > TOOLTIP_BOUNDARY_Y;
  const transformStyle: CSSProperties = {
    position: 'absolute',
    top: coordinate.y,
    left: safeLeft,
    transform: shouldShowAbove
      ? `translate(-50%, calc(-100% - ${TOOLTIP_OFFSET_Y}px))`
      : `translate(-50%, ${TOOLTIP_OFFSET_Y}px)`,
    pointerEvents: 'none',
    zIndex: 9999,
  };

  return (
    <div
      className="p-3 rounded-lg shadow-2xl border min-w-[220px] max-w-[280px] border-border bg-background"
      style={transformStyle}
    >
      <p className="font-bold mb-3 text-sm" title={data.apartmentName}>
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
