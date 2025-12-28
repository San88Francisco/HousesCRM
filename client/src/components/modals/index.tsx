import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';
import { HouseCreateUpdateModal } from './house-create-update-modal';
import { PdfContractModal } from './pdf-contract-modal';
import { RenterFormModal } from './renter-form/RenterFormModal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <RenterFormModal />
      <HouseCreateUpdateModal />
      <PdfContractModal />
    </>
  );
};
