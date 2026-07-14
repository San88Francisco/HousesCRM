import { LastMeterReading } from '@/shared/validation/meter-reading';
import { formatDate } from '@/shared/utils/format';

type Props = {
  metered: boolean;
  lastReading: LastMeterReading | null;
  tariffPrice: number | null;
  unit: string;
};

export const ReadingHint = ({ metered, lastReading, tariffPrice, unit }: Props) => {
  if (metered) {
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
