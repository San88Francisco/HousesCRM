import { formatDateRange } from '@/shared/utils/helpers/custom-tooltip-helper';

type Props = {
  color: string;
  breakInContracts: { start: string; end: string } | null;
};

export const NoContractTooltip = ({ color, breakInContracts }: Props) => {
  return (
    <div className="bg-text border border-gray-200 rounded-lg p-3 shadow-md pointer-events-none max-w-[240px] text-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold text-red">Відсутній контракт</span>
      </div>

      {breakInContracts && (
        <p className="text-red text-xs">
          {formatDateRange(breakInContracts.start, breakInContracts.end)}
        </p>
      )}
    </div>
  );
};
