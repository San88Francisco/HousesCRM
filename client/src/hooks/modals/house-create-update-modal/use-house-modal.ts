import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { House } from '@/types/core/house';
import { ModalState } from '@/types/core/modal-state';
import { ModalTriggers } from '@/types/model/modals';

export type HouseModalPayload = {
  house?: House;
};

export const useHouseModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(
    s => s.modal as ModalState<HouseModalPayload>,
  );

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_HOUSE || trigger === ModalTriggers.EDIT_HOUSE);

  const isEditMode = trigger === ModalTriggers.EDIT_HOUSE;

  const houseToEdit = isEditMode ? payload?.house : undefined;

  const handleClose = (reset?: () => void) => {
    dispatch(closeModal());
    reset?.();
  };

  const modalContent = {
    title: isEditMode ? 'Редагувати квартиру' : 'Додати нову квартиру',
    description: isEditMode
      ? 'Внесіть зміни до інформації про квартиру'
      : 'Заповніть форму для додавання нової квартири',
    submitText: isEditMode ? 'Зберегти зміни' : 'Додати квартиру',
    cancelText: 'Скасувати',
  };

  return {
    isThisModalOpen,
    isEditMode,
    houseToEdit,
    handleClose,
    modalContent,
  };
};
// const houseToEdit = isEditModalPayload<'house', House>(payload, 'house')
//   ? payload.house
//   : undefined;
