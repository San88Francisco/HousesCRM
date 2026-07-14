import { UtilityConfig } from '@/shared/constants/utilities';
import { cn } from '@/shared/utils/cn';
import { formatDate } from '@/shared/utils/format';
import { MeterReading } from '@/types/services/meters';
import { MeterReadingDeleteButton } from '@/widgets/utilities/MeterReadingDeleteButton';
import { ColumnDef } from '@tanstack/react-table';

const isBaseline = (reading: MeterReading) => reading.previousValue === null;

const dash = <span className="text-text opacity-40">—</span>;

const dateColumn: ColumnDef<MeterReading> = {
  accessorKey: 'readingDate',
  header: 'Дата',
  cell: ctx => <span className="font-medium">{formatDate(ctx.getValue<string>())}</span>,
};

const costColumn: ColumnDef<MeterReading> = {
  accessorKey: 'cost',
  header: 'Сума',
  cell: ctx => {
    const reading = ctx.row.original;

    if (reading.cost === null) {
      return dash;
    }

    return (
      <span className="flex flex-col items-center leading-tight">
        <span>
          <span className="rounded-full bg-green/30 px-2.5 py-0.5 text-base font-semibold text-text">
            {reading.cost.toFixed(2)} грн
          </span>
        </span>
        {reading.consumption !== null && (
          <span className="mt-1 text-xs text-text opacity-60">
            {reading.consumption} × {reading.tariffPrice} грн
          </span>
        )}
      </span>
    );
  },
};

const actionsColumn = (houseId: string, config: UtilityConfig): ColumnDef<MeterReading> => ({
  id: 'actions',
  header: 'Дії',
  cell: ctx => (
    <MeterReadingDeleteButton
      readingId={ctx.row.original.id}
      houseId={houseId}
      utilityType={config.type}
    />
  ),
});

const meteredColumns = (houseId: string, config: UtilityConfig): ColumnDef<MeterReading>[] => [
  dateColumn,
  {
    accessorKey: 'previousValue',
    header: 'Попередній',
    cell: ctx => {
      const value = ctx.getValue<number | null>();
      return value === null ? dash : <span className="text-text opacity-75">{value}</span>;
    },
  },
  {
    accessorKey: 'value',
    header: 'Новий показник',
    cell: ctx => <span className="text-base font-semibold">{ctx.getValue<number>()}</span>,
  },
  {
    id: 'consumption',
    header: 'Спожито',
    cell: ctx => {
      const reading = ctx.row.original;

      if (isBaseline(reading)) {
        return (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium text-text',
              config.pillBgClass,
            )}
          >
            Початковий показник
          </span>
        );
      }

      return (
        <span className="flex flex-col items-center leading-tight">
          <span>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 font-semibold text-text',
                config.pillBgClass,
              )}
            >
              {reading.consumption} {reading.unit}
            </span>
          </span>
          <span className="mt-1 text-xs text-text opacity-60">
            {reading.value} − {reading.previousValue}
          </span>
        </span>
      );
    },
  },
  {
    accessorKey: 'tariffPrice',
    header: 'Тариф',
    cell: ctx => {
      const reading = ctx.row.original;

      if (isBaseline(reading) || reading.tariffPrice === null) return dash;

      return (
        <span className="flex flex-col items-center leading-tight">
          <span className="font-medium">{reading.tariffPrice} грн</span>
          <span className="text-xs text-text opacity-60">за {reading.unit}</span>
        </span>
      );
    },
  },
  costColumn,
  actionsColumn(houseId, config),
];

const fixedFeeColumns = (houseId: string, config: UtilityConfig): ColumnDef<MeterReading>[] => [
  dateColumn,
  {
    accessorKey: 'tariffPrice',
    header: 'Тариф',
    cell: ctx => {
      const reading = ctx.row.original;

      if (reading.tariffPrice === null) return dash;

      return (
        <span className="flex flex-col items-center leading-tight">
          <span className="font-medium">{reading.tariffPrice} грн</span>
          <span className="text-xs text-text opacity-60">за {reading.unit}</span>
        </span>
      );
    },
  },
  costColumn,
  actionsColumn(houseId, config),
];

export const getMeterReadingsColumns = (
  houseId: string,
  config: UtilityConfig,
): ColumnDef<MeterReading>[] =>
  config.metered ? meteredColumns(houseId, config) : fixedFeeColumns(houseId, config);
