'use client';

import { KeyboardEvent, useState } from 'react';

import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format/format-date';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { ContractResponse } from '@/types/services/renters';
import { PdfContractTrigger } from '@/widgets/pdf-contract-content/pdf-contract-trigger';

type Props = {
  contract: ContractResponse;
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
          'absolute right-0 top-0 p-1 text-purple text-xs',
          contract.status === 'active' && 'text-yellow',
        )}
      >
        {contract.status === 'active' ? 'Активний' : 'Не активний'}
      </span>
    </li>
  );
};
