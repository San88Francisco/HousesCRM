import {
  formatCurrency,
  formatRate,
  TOOLTIP_Z_INDEX,
} from '@/shared/utils/all-house/currency-revaluation-chart/utils';
import { truncateText } from '@/shared/utils/text';
import { ChartDataItem } from '@/types/core/currency-revaluation-chart';
import React, { useEffect, useMemo, useState } from 'react';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

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

const TOOLTIP_WIDTH = 200;
const TOOLTIP_MAX_HEIGHT = 140;
const OFFSET_X = 10;
const OFFSET_Y = 10;
const PADDING = 8;

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

  useEffect(() => {
    if (!active || !coordinate || !chartContainerRef?.current) return;

    // Використовуємо SVG елемент для точних координат
    const chartElement =
      chartContainerRef.current.querySelector('svg') || chartContainerRef.current;

    const { width, height } = chartElement.getBoundingClientRect();

    let x = coordinate.x + OFFSET_X;
    let y = coordinate.y + OFFSET_Y;

    if (x + TOOLTIP_WIDTH > width) {
      x = coordinate.x - TOOLTIP_WIDTH - OFFSET_X;
    }

    if (y + TOOLTIP_MAX_HEIGHT > height) {
      y = coordinate.y - TOOLTIP_MAX_HEIGHT - OFFSET_Y;
    }

    setPosition({
      x: clamp(x, PADDING, width - TOOLTIP_WIDTH - PADDING),
      y: clamp(y, PADDING, height - TOOLTIP_MAX_HEIGHT - PADDING),
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
          {truncateText(data.apartmentName ?? 'Без назви', 25)}
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
