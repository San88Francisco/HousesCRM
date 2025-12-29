import { isRenterModalPayload } from '@/shared/utils/create-update-renter-form/is-renter-modal-payload';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';

export const useRenterModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_RENTER || trigger === ModalTriggers.EDIT_RENTER);

  const isEditMode = trigger === ModalTriggers.EDIT_RENTER;

  const renterToEdit = isRenterModalPayload(payload) ? payload.renter : undefined;

  const handleClose = (reset: () => void) => {
    dispatch(closeModal());
    reset();
  };

  const modalContent = {
    title: isEditMode ? 'Редагувати орендаря' : 'Створити нового орендаря',
    description: isEditMode
      ? 'Внесіть зміни до інформації про орендаря'
      : 'Заповніть форму для створення нового орендаря',
    submitText: isEditMode ? 'Зберегти зміни' : 'Додати орендаря',
  };

  return {
    isThisModalOpen,
    isEditMode,
    renterToEdit,
    handleClose,
    modalContent,
  };
};
