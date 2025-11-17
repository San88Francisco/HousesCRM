/* eslint-disable */
import { ChartDataItem } from '@/types/core/currency-revaluation-chart/types';
import {
  formatCurrency,
  formatRate,
  truncateText,
} from '@/shared/utils/all-apartments/currency-revaluation-chart/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  isDark: boolean;
}

const MAX_NAME_LENGTH = 20;

export const CustomTooltip = ({ active, payload, isDark }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div
      className={`p-3 rounded-lg shadow-2xl border ${
        isDark ? 'bg-[#1a1a1a] border-gray-700' : 'bg-white border-gray-200'
      }`}
      style={{ minWidth: '220px' }}
    >
      <p
        className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}
        title={data.apartmentName}
      >
        {truncateText(data.apartmentName, MAX_NAME_LENGTH)}
      </p>

      <div className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between gap-4 mb-1">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Початкова:</span>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              {formatCurrency(data.purchaseAmount)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Курс купівлі:</span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {formatRate(data.purchaseRate)}
            </span>
          </div>
        </div>

        <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        <div>
          <div className="flex justify-between gap-4 mb-1">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Поточна:</span>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              {formatCurrency(data.revaluationAmount)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>Поточний курс:</span>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {formatRate(data.currentRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
