import { ApartmentFormModal } from './apartment-form/ApartmentFormModal';
import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { PdfContractModal } from './pdf-contract-modal';
import { RenterFormModal } from './renter-form/RenterFormModal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <ApartmentFormModal />
      <RenterFormModal />
      <PdfContractModal />
    </>
  );
};
