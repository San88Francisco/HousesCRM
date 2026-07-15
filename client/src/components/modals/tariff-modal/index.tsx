'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { useTariffForm, useTariffModal } from '@/hooks/modals/tariff-modal';
import { deleteIconButtonClass } from '@/shared/constants/styles/delete-icon-button';
import { UTILITY_CONFIG } from '@/shared/constants/utilities';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format';
import { getCurrentTariff } from '@/shared/utils/meters/current-tariff';
import { useGetUtilityTariffsQuery } from '@/store/api/meters-api';
import { ModalTriggers } from '@/types/model/modals';
import { Banknote, Trash2 } from 'lucide-react';

export const TariffModal = () => {
  const {
    isActive,
    utilityType,
    label,
    tariffUnitLabel,
    handleClose: getHandleClose,
  } = useTariffModal();

  const { data: tariffs = [] } = useGetUtilityTariffsQuery(utilityType, { skip: !isActive });

  const { methods, onSubmit, onDelete, isLoading, reset } = useTariffForm(utilityType);

  const handleClose = () => getHandleClose(reset);

  const currentTariff = getCurrentTariff(tariffs);

  const config = UTILITY_CONFIG[utilityType];
  const Icon = config.icon;

  return (
    <Modal
      triggers={ModalTriggers.MANAGE_TARIFF}
      className="max-w-lg max-h-[90vh] overflow-y-auto"
      onClose={handleClose}
    >
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className={cn('rounded-xl p-2', config.softBgClass)}>
            <Icon size={20} className={config.colorClass} />
          </span>
          <div className="flex flex-col text-left">
            <DialogTitle className="text-lg font-semibold">Тариф — {label}</DialogTitle>
            <DialogDescription className="!mt-0">
              Тариф спільний для всіх квартир. Старі періоди рахуються за тарифом, що діяв на дату
              запису.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="rounded-md bg-muted/30 p-3 text-sm text-text">
        {currentTariff ? (
          <span>
            Чинний тариф: <span className="font-semibold">{currentTariff.pricePerUnit}</span>{' '}
            {tariffUnitLabel} (діє з {formatDate(currentTariff.validFrom)})
          </span>
        ) : (
          <span>Тариф не встановлено — додайте його, щоб бачити вартість.</span>
        )}
      </div>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RHFInput
            name="pricePerUnit"
            type="number"
            step="0.01"
            label={`Ціна, ${tariffUnitLabel}`}
            required
            icon={<Banknote size={16} />}
            placeholder="Наприклад, 4.32"
          />

          <RHFDatePicker name="validFrom" label="Діє з" ariaRequired />
        </div>

        <DialogFooter className="!mt-4 gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Зберігаємо...' : 'Зберегти тариф'}
          </Button>
        </DialogFooter>
      </RHFForm>

      {tariffs.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="text-sm font-medium">Історія тарифів</div>
          <ul className="flex flex-col gap-1">
            {tariffs.map(tariff => (
              <li
                key={tariff.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span>
                  <span className="font-semibold">{tariff.pricePerUnit}</span> {tariffUnitLabel} —
                  діє з {formatDate(tariff.validFrom)}
                  {currentTariff?.id === tariff.id && (
                    <span className="ml-2 text-xs text-muted-text">(чинний)</span>
                  )}
                </span>
                <Button
                  type="button"
                  variant="icon"
                  className={deleteIconButtonClass}
                  aria-label="Видалити тариф"
                  disabled={isLoading}
                  onClick={() => onDelete(tariff.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};
