import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalState } from '@/types/core/modal-state';
import { Renter } from '@/types/core/renter';
import { ModalTriggers } from '@/types/model/modals';

export type RenterModalPayload = {
  renter?: Renter;
};

export const useRenterModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(
    s => s.modal as ModalState<RenterModalPayload>,
  );

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_RENTER || trigger === ModalTriggers.EDIT_RENTER);

  const isEditMode = trigger === ModalTriggers.EDIT_RENTER;

  const renterToEdit = isEditMode ? payload?.renter : undefined;

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
    cancelText: 'Скасувати',
  };

  return {
    isThisModalOpen,
    isEditMode,
    renterToEdit,
    handleClose,
    modalContent,
  };
};
