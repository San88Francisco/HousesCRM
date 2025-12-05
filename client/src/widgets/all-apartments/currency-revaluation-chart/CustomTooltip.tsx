import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';
import { cn } from '@/shared/utils/cn';
import {
  formatRate,
  formatCurrency,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';

const MAX_NAME_LENGTH = 20;
const TOOLTIP_BOUNDARY_Y = 180;
const TOOLTIP_OFFSET_Y = 10;

const TooltipRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <span className="text-xs" style={{ color: 'var(--muted-text)' }}>
      {label}
    </span>
    <span className="text-xs" style={{ color: 'var(--text)' }}>
      {value}
    </span>
  </div>
);

const TooltipSection = ({
  title,
  amount,
  rate,
  rateLabel,
}: {
  title: string;
  amount: number;
  rate: number;
  rateLabel: string;
}) => (
  <div>
    <div className="flex justify-between gap-4 mb-1">
      <span className="text-xs" style={{ color: 'var(--muted-text)' }}>
        {title}
      </span>
      <span className="font-semibold text-xs" style={{ color: 'var(--text)' }}>
        {formatCurrency(amount)}
      </span>
    </div>
    <TooltipRow label={rateLabel} value={formatRate(rate)} />
  </div>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  isDark: boolean;
  coordinate?: { x: number; y: number };
}

const getTooltipPositionStyle = (coordinate: CustomTooltipProps['coordinate'], isDark: boolean) => {
  const shouldShowAbove = coordinate && coordinate.y > TOOLTIP_BOUNDARY_Y;
  const transform = shouldShowAbove ? 'translateY(-100%)' : `translateY(${TOOLTIP_OFFSET_Y}px)`;

  return {
    backgroundColor: isDark ? '#1a1a1a' : 'var(--white)',
    borderColor: 'var(--border)',
    position: 'relative',
    zIndex: 9999,
    transform: transform,
  };
};

export const CustomTooltip = ({ active, payload, isDark, coordinate }: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  const positionStyle = getTooltipPositionStyle(coordinate, isDark);

  return (
    <div
      className={cn('p-3 rounded-lg shadow-2xl border min-w-[220px] max-w-[280px]')}
      style={positionStyle}
    >
      <p
        className="font-bold mb-3 text-sm"
        style={{ color: 'var(--text)' }}
        title={data.apartmentName}
      >
        {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
      </p>

      <div className="space-y-2">
        <TooltipSection
          title="Початкова:"
          amount={data.purchaseAmount}
          rate={data.purchaseRate}
          rateLabel="Курс купівлі:"
        />

        <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

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
