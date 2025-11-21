import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';
import {
  formatRate,
  formatCurrency,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  isDark: boolean;
}

const MAX_NAME_LENGTH = 20;

const getTooltipStyles = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? '#1a1a1a' : 'var(--white)',
    borderColor: isDark ? 'var(--border)' : 'var(--border)',
  },
  title: {
    color: 'var(--text)',
  },
  label: {
    color: 'var(--muted-text)',
  },
  value: {
    color: 'var(--text)',
  },
  divider: {
    backgroundColor: 'var(--border)',
  },
});

const TooltipRow = ({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof getTooltipStyles>;
}) => (
  <div className="flex justify-between gap-4">
    <span className="text-xs" style={styles.label}>
      {label}
    </span>
    <span className="text-xs" style={styles.value}>
      {value}
    </span>
  </div>
);

const TooltipSection = ({
  title,
  amount,
  rate,
  rateLabel,
  styles,
}: {
  title: string;
  amount: number;
  rate: number;
  rateLabel: string;
  styles: ReturnType<typeof getTooltipStyles>;
}) => (
  <div>
    <div className="flex justify-between gap-4 mb-1">
      <span className="text-xs" style={styles.label}>
        {title}
      </span>
      <span className="font-semibold text-xs" style={styles.value}>
        {formatCurrency(amount)}
      </span>
    </div>
    <TooltipRow label={rateLabel} value={formatRate(rate)} styles={styles} />
  </div>
);

export const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const styles = getTooltipStyles(isDark);

  return (
    <div
      className="p-3 rounded-lg shadow-2xl border"
      style={{ minWidth: '220px', ...styles.container }}
    >
      <p className="font-bold mb-3 text-sm" style={styles.title} title={data.apartmentName}>
        {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
      </p>

      <div className="space-y-2">
        <TooltipSection
          title="Початкова:"
          amount={data.purchaseAmount}
          rate={data.purchaseRate}
          rateLabel="Курс купівлі:"
          styles={styles}
        />

        <div className="h-px" style={styles.divider} />

        <TooltipSection
          title="Поточна:"
          amount={data.revaluationAmount}
          rate={data.currentRate}
          rateLabel="Поточний курс:"
          styles={styles}
        />
      </div>
    </div>
  );
};
