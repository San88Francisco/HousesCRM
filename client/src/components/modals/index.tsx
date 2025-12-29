import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseCreateUpdateModal } from './house-create-update-modal';
import { PdfContractModal } from './pdf-contract-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <HouseCreateUpdateModal />
      <PdfContractModal />
    </>
  );
};
