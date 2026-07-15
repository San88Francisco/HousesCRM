import { LastMeterReading } from '@/shared/validation/meter-reading';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { UtilityType } from '@/types/services/meters';

type MeterReadingModalPayload = {
  houseId?: string;
  utilityType?: UtilityType;
  metered?: boolean;
  allowManual?: boolean;
  manualOnly?: boolean;
  label?: string;
  lastReading?: LastMeterReading | null;
  lastRecordDate?: string | null;
  lastAmount?: number | null;
  tariffPrice?: number | null;
  unit?: string;
};

export const useMeterReadingModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isActive = isOpen && trigger === ModalTriggers.ADD_METER_READING;
  const data = (payload ?? {}) as MeterReadingModalPayload;

  const handleClose = (reset?: () => void) => {
    dispatch(closeModal());
    reset?.();
  };

  return {
    isActive,
    houseId: data.houseId,
    utilityType: data.utilityType ?? UtilityType.ELECTRICITY,
    metered: data.metered ?? true,
    allowManual: data.allowManual ?? false,
    manualOnly: data.manualOnly ?? false,
    label: data.label ?? '',
    lastReading: data.lastReading ?? null,
    lastRecordDate: data.lastRecordDate ?? null,
    lastAmount: data.lastAmount ?? null,
    tariffPrice: data.tariffPrice ?? null,
    unit: data.unit ?? 'кВт·год',
    handleClose,
  };
};
