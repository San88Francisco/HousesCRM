import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { HouseModalPayload } from '@/types/model/house-create-update-modal/house-create-update-modal';
import { ModalTriggers } from '@/types/model/modals/modals';

export const useHouseModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_HOUSE || trigger === ModalTriggers.EDIT_HOUSE);

  const isEditMode = trigger === ModalTriggers.EDIT_HOUSE;

  const houseToEdit =
    payload && 'house' in payload ? (payload as HouseModalPayload).house : undefined;

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
  };

  return {
    isThisModalOpen,
    isEditMode,
    houseToEdit,
    handleClose,
    modalContent,
  };
};
