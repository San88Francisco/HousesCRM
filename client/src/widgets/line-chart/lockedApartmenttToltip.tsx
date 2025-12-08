import { Contract } from '@/types/core/line-chart';
import { formatDateRange, truncate } from '../../shared/utils/helpers/custom-tooltip-helper';

type Props = {
  color: string;
  apartmentName: string;
  contract: Contract;
};

export const LockedApartmentTooltip = ({ color, apartmentName, contract }: Props) => {
  const renterName = truncate(`${contract.renter.lastName} ${contract.renter.firstName}`, 20);
  const dateRange = formatDateRange(contract.commencement, contract.termination);

  return (
    <div className="bg-text border border-gray-200 rounded-lg p-3 shadow-md pointer-events-none max-w-[240px] text-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color, flexShrink: 0 }} />
        <span className="font-semibold text-background">{apartmentName}</span>
      </div>

      <div className="text-xs">
        <p className="text-background mb-1">Орендар: {renterName}</p>
        <p className="font-bold text-background mb-1">
          Оплата: {contract.monthlyPayment.toLocaleString()} грн/міс
        </p>
        <p className="text-background text-[11px]">{dateRange}</p>
      </div>
    </div>
  );
};
