import { UtilityMode } from '@/shared/constants/utilities';
import { formatDate } from '@/shared/utils/format';
import { LastMeterReading } from '@/shared/validation/meter-reading';

type Props = {
  mode: UtilityMode;
  lastReading: LastMeterReading | null;
  lastRecordDate: string | null;
  lastAmount: number | null;
  tariffPrice: number | null;
  unit: string;
};

export const ReadingHint = ({
  mode,
  lastReading,
  lastRecordDate,
  lastAmount,
  tariffPrice,
  unit,
}: Props) => {
  if (mode === 'manual') {
    return (
      <span>
        Запишемо лише дату і суму з платіжки, без розрахунків.
        {lastAmount !== null && lastRecordDate && (
          <>
            {' '}
            Останній запис: <span className="font-semibold">{lastAmount.toFixed(2)} грн</span> (
            {formatDate(lastRecordDate)})
          </>
        )}
      </span>
    );
  }

  if (mode === 'metered') {
    return lastReading ? (
      <span>
        Останній показник: <span className="font-semibold">{lastReading.value}</span> {unit} (
        {formatDate(lastReading.readingDate)})
      </span>
    ) : (
      <span>
        Це буде початковий (базовий) показник — споживання розраховуватиметься з наступного.
      </span>
    );
  }

  return tariffPrice !== null ? (
    <span>
      Фіксована плата за чинним тарифом:{' '}
      <span className="font-semibold">{tariffPrice.toFixed(2)} грн</span> за місяць
      {lastReading && <> (останнє нарахування: {formatDate(lastReading.readingDate)})</>}
    </span>
  ) : (
    <span>Тариф не встановлено — нарахування збережеться без суми.</span>
  );
};
