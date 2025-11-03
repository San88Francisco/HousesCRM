import { PaybackChartData } from '@/types/core/analytics';
import { formatPaybackCoefficient } from '@/shared/utils/payback';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
  isDark: boolean;
}

const MAX_NAME_LENGTH = 16;
const PRICE_DIVIDER = 1000;
const DECIMAL_PLACES = 0;

const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string => {
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

const formatPrice = (price: number): string => {
  return `$${(price / PRICE_DIVIDER).toFixed(DECIMAL_PLACES)}k`;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'short',
  });
};

interface TooltipRowProps {
  label: string;
  value: string;
  isDark: boolean;
  valueColor?: string;
}

const getTooltipValueClasses = (isDark: boolean, valueColor?: string): string => {
  const baseClasses = 'font-semibold';
  if (valueColor) {
    return baseClasses;
  }
  return `${baseClasses} ${isDark ? 'text-white' : 'text-black'}`;
};

const TooltipRow = ({ label, value, isDark, valueColor }: TooltipRowProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-black'}`}>{label}</span>
      <span
        className={getTooltipValueClasses(isDark, valueColor)}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
};

const TooltipHeader = ({ data }: { data: PaybackChartData }) => (
  <div className="mb-2 pb-2 border-b" style={{ borderColor: `${data.color}30` }}>
    <p
      className="font-bold text-sm sm:text-base"
      style={{ color: data.color }}
      title={data.apartmentName}
    >
      {truncateText(data.apartmentName)}
    </p>
  </div>
);

const TooltipStatus = ({ data }: { data: PaybackChartData }) => {
  if (!data.isFullyPaidBack) {
    return null;
  }

  return (
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
  );
};

const getContainerClasses = (isDark: boolean): string => {
  const baseClasses = 'p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-2xl border';
  const themeClasses = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  return `${baseClasses} ${themeClasses}`;
};

export const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div
      className={getContainerClasses(isDark)}
      style={{
        borderColor: data.color,
        borderWidth: '2px',
        maxWidth: '220px',
        minWidth: '180px',
      }}
    >
      <TooltipHeader data={data} />

      <div className="space-y-1.5 text-xs sm:text-sm">
        <TooltipRow
          label="Окупність"
          value={formatPaybackCoefficient(data.paybackCoefficient)}
          isDark={isDark}
          valueColor={data.color}
        />

        <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        <TooltipRow label="Вартість" value={formatPrice(data.purchasePriceUSD)} isDark={isDark} />

        <TooltipRow label="Заплачено" value={formatPrice(data.totalIncomeUSD)} isDark={isDark} />

        <TooltipRow label="Дата" value={formatDate(data.purchaseDate)} isDark={isDark} />
      </div>

      <TooltipStatus data={data} />
    </div>
  );
};
