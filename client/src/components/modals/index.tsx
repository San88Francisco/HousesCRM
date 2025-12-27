import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseFormModal } from './create-house-form/HouseFormModal';
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
