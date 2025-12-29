import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { ContractModal } from './contract-modal';
import { HouseFormModal } from './create-house-form/HouseFormModal';
import { PdfContractModal } from './pdf-contract-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <HouseFormModal />
      <PdfContractModal />
      <ContractModal />
    </>
  );
};
