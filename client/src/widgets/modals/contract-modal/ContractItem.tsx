'use client';

import { KeyboardEvent, useState } from 'react';

import { Badge } from '@/shared/ui/badge';
import { getStatusLabel } from '@/shared/utils/create-update-contract-form/status-labels';
import { formatDate } from '@/shared/utils/format';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Contract } from '@/types/core/contract';
import { ContractStatus } from '@/types/core/status';
import { ModalTriggers } from '@/types/model/modals';
import { PdfContractTrigger } from '@/widgets/modals/pdf-contract-content-modal/PdfContractTrigger';

type Props = {
  contract: Contract;
};

export const ContractItem = ({ contract }: Props) => {
  const [hovered, setHovered] = useState(false);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.PDF_CONTRACT,
        payload: { id: contract.id },
      }),
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      className="mb-4 flex gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted-foreground transition-colors duration-300 relative"
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <PdfContractTrigger id={contract.id} isHovered={hovered} />

      <div className="flex flex-col gap-1">
        <span>
          з {formatDate(contract.commencement)} до {formatDate(contract.termination)}
        </span>
        <span className="text-muted">Місячна оплата: {contract.monthlyPayment} грн.</span>
      </div>
      <Badge
        className="absolute right-2 top-2"
        variant={
          contract.status === ContractStatus.ACTIVE
            ? ContractStatus.ACTIVE
            : ContractStatus.INACTIVE
        }
      >
        {getStatusLabel(contract.status)}
      </Badge>
    </li>
  );
};
