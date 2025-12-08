import { Apartment, PayloadData } from '@/types/core/line-chart';
import {
  findGapBetweenContracts,
  formatDateRange,
  truncate,
} from '../../../shared/utils/helpers/custom-tooltip-helper';
import { isContract } from '@/shared/utils/line-chart/line-chart';

type Props = {
  apartment: Apartment;
  color: string;
  allData: PayloadData;
  apartmentsData: Apartment[];
  cursorDate: string;
};

export const ApartmentItem = ({ apartment, color, allData, apartmentsData, cursorDate }: Props) => {
  const contractCandidate = allData[`${apartment.id}_contract`];
  const breakInContracts = findGapBetweenContracts(apartment.id, apartmentsData, cursorDate);

  if (!isContract(contractCandidate)) {
    return (
      <div className="mb-1">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-red">Відсутній контракт</span>
        </div>

        <div className="ml-3 text-red" style={{ fontSize: '10px', lineHeight: '1.1' }}>
          {breakInContracts
            ? formatDateRange(breakInContracts.start, breakInContracts.end)
            : 'Відсутній у цей період'}
        </div>
      </div>
    );
  }

  const contract = contractCandidate;
  const renterName = truncate(`${contract.renter.lastName} ${contract.renter.firstName}`, 15);
  const dateRange = formatDateRange(contract.commencement, contract.termination);

  return (
    <div className="mb-1">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-background">
          {`${renterName}: ${contract.monthlyPayment.toLocaleString()}`}
        </span>
      </div>

      <div className="ml-3 text-background" style={{ fontSize: '10px', lineHeight: '1.1' }}>
        {dateRange}
      </div>
    </div>
  );
};
