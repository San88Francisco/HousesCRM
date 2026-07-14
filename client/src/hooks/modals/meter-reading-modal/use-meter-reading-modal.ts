import { LastMeterReading } from '@/shared/validation/meter-reading';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { UtilityType } from '@/types/services/meters';

export const useMeterReadingModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isActive = isOpen && trigger === ModalTriggers.ADD_METER_READING;

  const houseId = payload?.houseId as string | undefined;
  const utilityType = (payload?.utilityType as UtilityType | undefined) ?? UtilityType.ELECTRICITY;
  const metered = (payload?.metered as boolean | undefined) ?? true;
  const label = (payload?.label as string | undefined) ?? '';
  const lastReading = (payload?.lastReading as LastMeterReading | undefined) ?? null;
  const tariffPrice = (payload?.tariffPrice as number | undefined) ?? null;
  const unit = (payload?.unit as string | undefined) ?? 'кВт·год';

  const handleClose = (reset?: () => void) => {
    dispatch(closeModal());
    reset?.();
  };

  return {
    isActive,
    houseId,
    utilityType,
    metered,
    label,
    lastReading,
    tariffPrice,
    unit,
    handleClose,
  };
};
