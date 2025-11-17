/* eslint-disable */
import { PaybackChartData } from '@/types/core/payback-chart/analytics';
import { formatPaybackCoefficient } from '@/shared/utils/all-apartments/payback-chart/payback';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PaybackChartData }>;
  isDark: boolean;
}

const MAX_NAME_LENGTH = 16;
const PRICE_DIVIDER = 1000;
const DECIMAL_PLACES = 0;

const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

export const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data: PaybackChartData = payload[0].payload;

  return (
    <div
      className={`p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-2xl border ${
        isDark ? 'bg-[#1a1a1a]' : 'bg-white'
      }`}
      style={{
        borderColor: data.color,
        borderWidth: '2px',
        maxWidth: '220px',
        minWidth: '180px',
      }}
    >
      <div className="mb-2 pb-2 border-b" style={{ borderColor: `${data.color}30` }}>
        <p
          className="font-bold text-sm sm:text-base"
          style={{ color: data.color }}
          title={data.apartmentName}
        >
          {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
        </p>
      </div>

      <div className="space-y-1.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-black'}`}>
            Окупність
          </span>
          <span className="font-bold text-sm sm:text-base" style={{ color: data.color }}>
            {formatPaybackCoefficient(data.paybackCoefficient)}
          </span>
        </div>

        <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-black'}`}>Вартість</span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            ${(data.purchasePriceUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES)}k
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-black'}`}>
            Заплачено
          </span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            ${(data.totalIncomeUSD / PRICE_DIVIDER).toFixed(DECIMAL_PLACES)}k
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-black'}`}>Дата</span>
          <span className={`font-medium text-xs ${isDark ? 'text-gray-400' : 'text-black'}`}>
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
