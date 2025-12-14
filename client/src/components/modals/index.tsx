import { ApartmentFormModal } from './aparment-form/ApartmentFormModal';
import { ConfirmDeleteModal } from './confirm-delete-modal/ConfirmDeleteModal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <ApartmentFormModal />
    </>
  );
};
