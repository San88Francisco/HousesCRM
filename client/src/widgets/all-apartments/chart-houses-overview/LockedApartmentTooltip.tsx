import { formatDateRange, truncate } from '@/shared/utils/helpers/custom-tooltip-helper';
import { Contract } from '@/types/core/houses-overview/types';

type Props = {
  color: string;
  apartmentName: string;
  contract: Contract;
};

export const LockedApartmentTooltip = ({ color, apartmentName, contract }: Props) => {
  const renterName = truncate(
    `${contract.renter.lastName ?? ''} ${contract.renter.firstName ?? ''}`.trim() || '—',
    20,
  );
  const dateRange = formatDateRange(contract.commencement, contract.termination);

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-2xl pointer-events-none max-w-[240px] text-sm">
      <div className="flex items-center gap-2 mb-2 ">
        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
        <span className="font-semibold ">{apartmentName}</span>
      </div>

      <div className="text-xs">
        <p className="text-muted mb-1 border-b border-border pb-2">Орендар: {renterName}</p>
        <p className="font-bold  mb-1">
          Оплата: {contract.monthlyPayment.toLocaleString('uk-UA')} грн/міс
        </p>
        <p className="text-muted text-[11px]">{dateRange}</p>
      </div>
    </div>
  );
};
