'use client';

import { KeyboardEvent, useState } from 'react';

import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Contract } from '@/types/core/contract';
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
      <span
        className={cn(
          'absolute right-0 top-0 rounded-full px-2 py-0.5 text-xs font-semibold m-2 text-white ',
          contract.status === 'active' ? 'bg-gold' : 'bg-purple',
        )}
      >
        {contract.status === 'active' ? 'Активний' : 'Не активний'}
      </span>
    </li>
  );
};
