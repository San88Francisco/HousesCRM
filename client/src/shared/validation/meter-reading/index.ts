import { UtilityMode } from '@/shared/constants/utilities';
import * as yup from 'yup';

export type LastMeterReading = {
  value: number;
  readingDate: string;
};

type SchemaParams = {
  lastReading: LastMeterReading | null;
  lastRecordDate: string | null;
  mode: UtilityMode;
};

const optionalNumber = () => yup.number().nullable().notRequired();

export const buildMeterReadingSchema = ({ lastReading, lastRecordDate, mode }: SchemaParams) =>
  yup.object({
    value:
      mode === 'metered'
        ? yup
            .number()
            .typeError('Показник має бути числом')
            .required("Показник обов'язковий")
            .min(0, 'Показник не може бути від’ємним')
            .test(
              'gte-previous',
              `Показник має бути не меншим за попередній (${lastReading?.value ?? 0})`,
              value => {
                if (value === undefined || value === null || !lastReading) return true;
                return value >= lastReading.value;
              },
            )
        : optionalNumber(),

    amount:
      mode === 'manual'
        ? yup
            .number()
            .typeError('Сума має бути числом')
            .required("Сума обов'язкова")
            .positive('Сума має бути більше 0')
        : optionalNumber(),

    readingDate: yup
      .string()
      .required("Дата обов'язкова")
      .test('not-in-future', 'Дата не може бути в майбутньому', value => {
        if (!value) return false;
        return new Date(value) <= new Date();
      })
      .test(
        'after-previous',
        `Дата має бути пізнішою за дату попереднього запису (${lastRecordDate ?? ''})`,
        value => {
          if (!value || !lastRecordDate) return true;
          return new Date(value) > new Date(lastRecordDate);
        },
      ),
  });

export type MeterReadingFormData = {
  value?: number | null;
  amount?: number | null;
  readingDate: string;
};
