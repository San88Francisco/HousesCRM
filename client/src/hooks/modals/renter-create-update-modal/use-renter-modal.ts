import { isEditModalPayload } from '@/shared/utils/helpers/is-edit-modal-payload';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { Renter } from '@/types/core/renter';
import { ModalTriggers } from '@/types/model/modals';

export const useRenterModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_RENTER || trigger === ModalTriggers.EDIT_RENTER);

  const isEditMode = trigger === ModalTriggers.EDIT_RENTER;

  const renterToEdit = isEditModalPayload<'renter', Renter>(payload, 'renter')
    ? payload.renter
    : undefined;

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
