'use client';

import { useState } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { formatDate } from '@/shared/utils/format/format-date';
import { PdfContractTrigger } from '@/widgets/pdf-contract-content/pdf-contract-trigger';
import { ContractResponse } from '@/types/services/renters';

type Props = {
  contract: ContractResponse;
};

export const ContractItem = ({ contract }: Props) => {
  const [hovered, setHovered] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <li
      className="mb-4 flex gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted-foreground transition-colors duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        dispatch(
          openModal({
            trigger: ModalTriggers.PDF_CONTRACT,
            payload: { id: contract.id },
          }),
        )
      }
    >
      <PdfContractTrigger id={contract.id} isHovered={hovered} />

      <div className="flex flex-col gap-1">
        <span>
          з {formatDate(contract.commencement)} до {formatDate(contract.termination)}
        </span>
        <span className="text-muted">Місячна оплата: {contract.monthlyPayment} грн.</span>
      </div>
    </li>
  );
};
