'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFForm } from '@/components/RHF/RHForm';
import { useMeterReadingForm, useMeterReadingModal } from '@/hooks/modals/meter-reading-modal';
import { resolveUtilityMode, UTILITY_CONFIG, UtilityMode } from '@/shared/constants/utilities';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/utils/cn';
import { computeReadingPreview } from '@/shared/utils/meters/reading-preview';
import { ModalTriggers } from '@/types/model/modals';
import { useState } from 'react';
import { AmountOrValueField } from './AmountOrValueField';
import { CalculationPreview } from './CalculationPreview';
import { ReadingHint } from './ReadingHint';

const modalTextsByMode: Record<UtilityMode, { title: string; submitText: string }> = {
  metered: { title: 'Додати показник лічильника', submitText: 'Додати показник' },
  'fixed-fee': { title: 'Нарахувати місяць', submitText: 'Нарахувати' },
  manual: { title: 'Записати суму', submitText: 'Записати суму' },
};

export const MeterReadingModal = () => {
  const {
    houseId,
    utilityType,
    metered,
    allowManual,
    manualOnly,
    label,
    lastReading,
    lastRecordDate,
    lastAmount,
    tariffPrice,
    unit,
    handleClose: getHandleClose,
  } = useMeterReadingModal();

  const [manualMode, setManualMode] = useState(false);
  const manual = manualOnly || (allowManual && manualMode);
  const mode = resolveUtilityMode(metered, manual);

  const { methods, onSubmit, isLoading, reset } = useMeterReadingForm({
    houseId,
    utilityType,
    mode,
    lastReading,
    lastRecordDate,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => {
    setManualMode(false);
    getHandleClose(reset);
  };

  const { numericValue, consumption, cost } = computeReadingPreview(
    mode === 'metered',
    lastReading,
    methods.watch('value'),
    tariffPrice,
  );

  const { title, submitText } = modalTextsByMode[mode];

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
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <DialogDescription className="!mt-0">{label}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {allowManual && !manualOnly && (
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <Label htmlFor="manual-mode" className="text-sm text-text cursor-pointer">
            Квартира без лічильника
          </Label>
          <Switch id="manual-mode" checked={manualMode} onCheckedChange={setManualMode} />
        </div>
      )}

      <div className="rounded-md bg-muted/30 p-3 text-sm text-text">
        <ReadingHint
          mode={mode}
          lastReading={lastReading}
          lastRecordDate={lastRecordDate}
          lastAmount={lastAmount}
          tariffPrice={tariffPrice}
          unit={unit}
        />
      </div>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <AmountOrValueField
          mode={mode}
          unit={unit}
          lastReading={lastReading}
          lastAmount={lastAmount}
        />

        <RHFDatePicker
          name="readingDate"
          label={mode === 'metered' ? 'Дата зняття показника' : 'Дата нарахування'}
          ariaRequired
        />

        {mode === 'metered' && consumption !== null && lastReading && (
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
