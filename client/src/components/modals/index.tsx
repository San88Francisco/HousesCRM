import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { ContractModal } from './contract-modal';
import { PdfContractModal } from './pdf-contract-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <PdfContractModal />
      <ContractModal />
    </>
  );
};
