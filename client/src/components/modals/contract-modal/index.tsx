'use client';

import { skipToken } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/store/hooks';
import Modal from '../modal-wrapper';
import { ModalTriggers } from '@/types/model/modals';
import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useGetAllContractsByRenterIdQuery } from '@/store/renters-api';
import { ContractItem } from './ContractItem';

export const ContractModal = () => {
  const renterId = useAppSelector(state => state.modal.payload?.id as string | undefined);

  const { data } = useGetAllContractsByRenterIdQuery(renterId ?? skipToken);

  if (!data) return null;

  return (
    <Modal triggers={ModalTriggers.OPEN_CONTRACTS_LIST} className="max-w-2xl ">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          Всі договори орендаря {data.oneRenterReport.firstName} {data.oneRenterReport.lastName}
        </DialogTitle>
        <DialogDescription>Тут відображається список всіх договорів орендаря</DialogDescription>
      </DialogHeader>

      <ul className="mt-4 max-h-[60vh] overflow-y-auto px-2">
        {data.allContractsByRenterId.data.map(contract => {
          return <ContractItem key={contract.id} contract={contract} />;
        })}
      </ul>
    </Modal>
  );
};
