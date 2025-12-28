import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/modal-slice';
import { ApartmentModalPayload } from '@/types/model/apartment-modal';
import { ModalTriggers } from '@/types/model/modals';

export const useHouseModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_HOUSE || trigger === ModalTriggers.EDIT_HOUSE);

  const isEditMode = trigger === ModalTriggers.EDIT_HOUSE;

  const apartmentToEdit =
    payload && 'apartment' in payload ? (payload as ApartmentModalPayload).apartment : undefined;

  const handleClose = (reset: () => void) => {
    dispatch(closeModal());
    reset();
  };

  const modalContent = {
    title: isEditMode ? 'Редагувати квартиру' : 'Додати нову квартиру',
    description: isEditMode
      ? 'Внесіть зміни до інформації про квартиру'
      : 'Заповніть форму для додавання нової квартири',
    submitText: isEditMode ? 'Зберегти зміни' : 'Додати квартиру',
  };

  return {
    isThisModalOpen,
    isEditMode,
    apartmentToEdit,
    handleClose,
    modalContent,
  };
};
