import { RHFInput } from '@/components/RHF/RHFInput';
import { UtilityMode } from '@/shared/constants/utilities';
import { LastMeterReading } from '@/shared/validation/meter-reading';
import { Banknote, Gauge } from 'lucide-react';

type Props = {
  mode: UtilityMode;
  unit: string;
  lastReading: LastMeterReading | null;
  lastAmount: number | null;
};

export const AmountOrValueField = ({ mode, unit, lastReading, lastAmount }: Props) => {
  if (mode === 'manual') {
    return (
      <RHFInput
        name="amount"
        type="number"
        step="0.01"
        label="Сума, грн"
        required
        icon={<Banknote size={16} />}
        placeholder={lastAmount !== null ? `Минулого разу: ${lastAmount}` : 'Наприклад, 850'}
      />
    );
  }

  if (mode !== 'metered') return null;

  return (
    <RHFInput
      name="value"
      type="number"
      label={`Новий показник, ${unit}`}
      required
      icon={<Gauge size={16} />}
      placeholder={lastReading ? `Не менше ${lastReading.value}` : 'Наприклад, 1100'}
    />
  );
};
