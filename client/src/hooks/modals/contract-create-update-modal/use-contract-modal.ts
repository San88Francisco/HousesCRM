import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ContractCreateUpdate } from '@/types/core/contract';
import { ModalState } from '@/types/core/modal-state';
import { ModalTriggers } from '@/types/model/modals';

export type ContractModalPayload = {
  contract?: ContractCreateUpdate;
};

export const useContractModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(
    s => s.modal as ModalState<ContractModalPayload>,
  );

  const isThisModalOpen =
    isOpen && (trigger === ModalTriggers.ADD_CONTRACT || trigger === ModalTriggers.EDIT_CONTRACT);

  const isEditMode = trigger === ModalTriggers.EDIT_CONTRACT;

  const contractToEdit = isEditMode ? payload?.contract : undefined;

  const handleClose = (reset?: () => void) => {
    dispatch(closeModal());
    reset?.();
  };

  const modalContent = {
    title: isEditMode ? 'Редагувати контракт' : 'Створити новий контракт',
    description: isEditMode
      ? 'Внесіть зміни до інформації про контракт'
      : 'Заповніть форму для створення нового контракту',
    submitText: isEditMode ? 'Зберегти зміни' : 'Додати контракт',
    cancelText: 'Скасувати',
  };

  return {
    isThisModalOpen,
    isEditMode,
    contractToEdit,
    handleClose,
    modalContent,
  };
};
