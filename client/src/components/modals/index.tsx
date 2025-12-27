import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './create-house-form/HouseFormModal';
import { PdfContractModal } from './pdf-contract-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <HouseFormModal />
      <PdfContractModal />
    </>
  );
};
