import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { UtilityType } from '@/types/services/meters';

export const useTariffModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isActive = isOpen && trigger === ModalTriggers.MANAGE_TARIFF;

  const utilityType = (payload?.utilityType as UtilityType | undefined) ?? UtilityType.ELECTRICITY;
  const label = (payload?.label as string | undefined) ?? '';
  const tariffUnitLabel = (payload?.tariffUnitLabel as string | undefined) ?? 'грн';

  const handleClose = (reset?: () => void) => {
    dispatch(closeModal());
    reset?.();
  };

  return { isActive, utilityType, label, tariffUnitLabel, handleClose };
};
