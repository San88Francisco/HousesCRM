import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './create-update-house-form';
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
