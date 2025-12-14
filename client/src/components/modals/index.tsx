import { ApartmentFormModal } from './aparment-form/ApartmentFormModal';
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
