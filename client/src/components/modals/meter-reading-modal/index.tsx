'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { useMeterReadingForm, useMeterReadingModal } from '@/hooks/modals/meter-reading-modal';
import { UTILITY_CONFIG } from '@/shared/constants/utilities';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { cn } from '@/shared/utils/cn';
import { computeReadingPreview } from '@/shared/utils/meters/reading-preview';
import { ModalTriggers } from '@/types/model/modals';
import { Gauge } from 'lucide-react';
import { CalculationPreview } from './CalculationPreview';
import { ReadingHint } from './ReadingHint';

export const MeterReadingModal = () => {
  const {
    houseId,
    utilityType,
    metered,
    label,
    lastReading,
    tariffPrice,
    unit,
    handleClose: getHandleClose,
  } = useMeterReadingModal();

  const { methods, onSubmit, isLoading, reset } = useMeterReadingForm({
    houseId,
    utilityType,
    metered,
    lastReading,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => getHandleClose(reset);

  const { numericValue, consumption, cost } = computeReadingPreview(
    metered,
    lastReading,
    methods.watch('value'),
    tariffPrice,
  );

  const submitText = metered ? 'Додати показник' : 'Нарахувати';

  const config = UTILITY_CONFIG[utilityType];
  const Icon = config.icon;

  return (
    <Modal
      triggers={ModalTriggers.ADD_METER_READING}
      className="max-w-lg max-h-[90vh] overflow-y-auto"
      onClose={handleClose}
    >
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className={cn('rounded-xl p-2', config.softBgClass)}>
            <Icon size={20} className={config.colorClass} />
          </span>
          <div className="flex flex-col text-left">
            <DialogTitle className="text-lg font-semibold">
              {metered ? 'Додати показник лічильника' : 'Нарахувати місяць'}
            </DialogTitle>
            <DialogDescription className="!mt-0">{label}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="rounded-md bg-muted/30 p-3 text-sm text-text">
        <ReadingHint
          metered={metered}
          lastReading={lastReading}
          tariffPrice={tariffPrice}
          unit={unit}
        />
      </div>

      <RHFForm form={methods} onSubmit={onSubmit}>
        {metered && (
          <RHFInput
            name="value"
            type="number"
            label={`Новий показник, ${unit}`}
            required
            icon={<Gauge size={16} />}
            placeholder={lastReading ? `Не менше ${lastReading.value}` : 'Наприклад, 1100'}
          />
        )}

        <RHFDatePicker
          name="readingDate"
          label={metered ? 'Дата зняття показника' : 'Дата нарахування'}
          ariaRequired
        />

        {consumption !== null && lastReading && (
          <CalculationPreview
            numericValue={numericValue}
            previousValue={lastReading.value}
            consumption={consumption}
            cost={cost}
            tariffPrice={tariffPrice}
            unit={unit}
            pillBgClass={config.pillBgClass}
          />
        )}

        <DialogFooter className="!mt-6 gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Додаємо...' : submitText}
          </Button>
        </DialogFooter>
      </RHFForm>
    </Modal>
  );
};
