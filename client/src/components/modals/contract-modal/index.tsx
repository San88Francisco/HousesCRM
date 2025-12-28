'use client';

import { useContractsModal } from '@/hooks/use-contract-modal';
import { DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useAppSelector } from '@/store/hooks';
import { ModalTriggers } from '@/types/model/modals';
import { useEffect, useState } from 'react';
import Modal from '../modal-wrapper';
import { ContractListContent } from './ContractListContent';

export const ContractModal = () => {
  const { isOpen, trigger, payload } = useAppSelector(state => state.modal);
  const [renterId, setRenterId] = useState<string>('');
  const [observerResetKey, setObserverResetKey] = useState<number>(0);

  const isThisModalActive = isOpen && trigger === ModalTriggers.OPEN_CONTRACTS_LIST;
  const isPdfModalOpen = isOpen && trigger === ModalTriggers.PDF_CONTRACT;

  useEffect(() => {
    if (isThisModalActive && payload?.id) {
      setRenterId(payload.id as string);
    }
  }, [isThisModalActive, payload?.id]);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (!isPdfModalOpen && isThisModalActive) {
      timeoutId = window.setTimeout(() => {
        setObserverResetKey(prev => prev + 1);
      }, 100);
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isPdfModalOpen, isThisModalActive]);

  const { contracts, renterInfo, isFetching, hasMore, loadMoreRef } = useContractsModal(
    renterId,
    isThisModalActive,
    observerResetKey,
  );

  const shouldRender = renterInfo || contracts.length > 0 || isFetching;
  if (!shouldRender) return null;

  return (
    <Modal triggers={ModalTriggers.OPEN_CONTRACTS_LIST} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {renterInfo
            ? `Всі договори орендаря ${renterInfo.firstName} ${renterInfo.lastName}`
            : 'Завантаження...'}
        </DialogTitle>
        <DialogDescription>Тут відображається список всіх договорів орендаря</DialogDescription>
      </DialogHeader>

      <ContractListContent
        contracts={contracts}
        isFetching={isFetching}
        hasMore={hasMore}
        loadMoreRef={loadMoreRef}
      />
    </Modal>
  );
};
