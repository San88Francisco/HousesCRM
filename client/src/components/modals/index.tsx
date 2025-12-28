import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './create-update-house-form';
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
