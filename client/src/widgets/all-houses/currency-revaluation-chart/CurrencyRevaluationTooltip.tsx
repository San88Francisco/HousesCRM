import { clamp } from '@/shared/utils/all-house/currency-revaluation-chart/math';
import {
  formatCurrency,
  formatRate,
  TOOLTIP_MAX_HEIGHT,
  TOOLTIP_NAME_MAX_LENGTH,
  TOOLTIP_OFFSET_X,
  TOOLTIP_OFFSET_Y,
  TOOLTIP_PADDING,
  TOOLTIP_WIDTH,
  TOOLTIP_Z_INDEX,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { truncateText } from '@/shared/utils/text';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart';
import React, { useLayoutEffect, useMemo, useState } from 'react';

type TooltipRowProps = {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
};

const TooltipRow = ({ label, value, bold }: TooltipRowProps) => (
  <div className="flex justify-between gap-2">
    <span className="text-xs text-muted whitespace-nowrap">{label}</span>
    <span className={bold ? 'text-xs font-semibold' : 'text-xs font-medium'}>{value}</span>
  </div>
);

type TooltipSectionProps = {
  title: string;
  amount: number;
  rate: number;
  rateLabel: string;
};

const TooltipSection = ({ title, amount, rate, rateLabel }: TooltipSectionProps) => (
  <div className="space-y-1">
    <TooltipRow label={title} value={formatCurrency(amount)} bold />
    <TooltipRow label={rateLabel} value={formatRate(rate)} />
  </div>
);

type Props = {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  coordinate?: { x: number; y: number };
  chartContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export const CurrencyRevaluationTooltip = ({
  active,
  payload,
  coordinate,
  chartContainerRef,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!active || !coordinate || !chartContainerRef?.current) return;

    const chartElement =
      chartContainerRef.current.querySelector('svg') || chartContainerRef.current;

    const { width, height } = chartElement.getBoundingClientRect();

    let x = coordinate.x + TOOLTIP_OFFSET_X;
    let y = coordinate.y + TOOLTIP_OFFSET_Y;

    if (x + TOOLTIP_WIDTH > width) {
      x = coordinate.x - TOOLTIP_WIDTH - TOOLTIP_OFFSET_X;
    }

    if (y + TOOLTIP_MAX_HEIGHT > height) {
      y = coordinate.y - TOOLTIP_MAX_HEIGHT - TOOLTIP_OFFSET_Y;
    }

    setPosition({
      x: clamp(x, TOOLTIP_PADDING, width - TOOLTIP_WIDTH - TOOLTIP_PADDING),
      y: clamp(y, TOOLTIP_PADDING, height - TOOLTIP_MAX_HEIGHT - TOOLTIP_PADDING),
    });
  }, [active, coordinate, chartContainerRef]);

  const data = payload?.[0]?.payload;

  const sections = useMemo(() => {
    if (!data) return [];

    return [
      {
        title: 'Початкова:',
        amount: data.purchaseAmount,
        rate: data.purchaseRate,
        rateLabel: 'Курс купівлі:',
      },
      {
        title: 'Поточна:',
        amount: data.revaluationAmount,
        rate: data.currentRate,
        rateLabel: 'Поточний курс:',
      },
    ];
  }, [data]);

  if (!active || !data || !coordinate) return null;

  return (
    <div
      role="tooltip"
      className="p-2 rounded-lg border border-border bg-background animate-in fade-in-0 zoom-in-95 duration-150"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: TOOLTIP_WIDTH,
        maxHeight: TOOLTIP_MAX_HEIGHT,
        pointerEvents: 'none',
        zIndex: TOOLTIP_Z_INDEX,
        overflow: 'hidden',
      }}
    >
      <div className="h-full overflow-y-auto pr-1 custom-scrollbar tooltip-scroll">
        <p className="font-bold mb-2 text-xs" title={data.apartmentName ?? 'Без назви'}>
          {truncateText(data.apartmentName ?? 'Без назви', TOOLTIP_NAME_MAX_LENGTH)}
        </p>

        <div className="space-y-2">
          {sections.map((section, index) => (
            <React.Fragment key={section.title}>
              {index > 0 && <div className="h-px bg-border" />}
              <TooltipSection {...section} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
