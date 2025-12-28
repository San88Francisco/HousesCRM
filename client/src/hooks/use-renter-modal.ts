import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { RenterModalPayload } from '@/types/model/renter';

export const useRenterModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_RENTER || trigger === ModalTriggers.EDIT_RENTER);

  const isEditMode = trigger === ModalTriggers.EDIT_RENTER;

  const renterToEdit =
    payload && 'renter' in payload ? (payload as unknown as RenterModalPayload).renter : undefined;

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
