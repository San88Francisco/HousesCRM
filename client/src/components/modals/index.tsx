import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './house-create-update-modal';
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
