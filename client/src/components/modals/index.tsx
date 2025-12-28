import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './house-create-update-modal';
import { PdfContractModal } from './pdf-contract-modal';
import { RenterFormModal } from './renter-form/RenterFormModal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <RenterFormModal />
      <HouseFormModal />
      <PdfContractModal />
    </>
  );
};
