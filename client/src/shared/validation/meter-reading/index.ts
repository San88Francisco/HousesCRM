import * as yup from 'yup';

export type LastMeterReading = {
  value: number;
  readingDate: string;
};

export const buildMeterReadingSchema = (lastReading: LastMeterReading | null, metered: boolean) =>
  yup.object({
    value: metered
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
      : yup.number().nullable().notRequired(),

    readingDate: yup
      .string()
      .required("Дата обов'язкова")
      .test('not-in-future', 'Дата не може бути в майбутньому', value => {
        if (!value) return false;
        return new Date(value) <= new Date();
      })
      .test(
        'after-previous',
        `Дата має бути пізнішою за дату попереднього запису (${lastReading?.readingDate ?? ''})`,
        value => {
          if (!value || !lastReading) return true;
          return new Date(value) > new Date(lastReading.readingDate);
        },
      ),
  });

export type MeterReadingFormData = {
  value?: number | null;
  readingDate: string;
};
