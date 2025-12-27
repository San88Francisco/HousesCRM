import { ApartmentFormModal } from './create-house-form/HouseFormModal';
import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { PdfContractModal } from './pdf-contract-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <ApartmentFormModal />
      <PdfContractModal />
    </>
  );
};
