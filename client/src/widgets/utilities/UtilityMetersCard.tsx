'use client';

import { ErrorState } from '@/components/chart-states/ErrorState';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { useToastOnError } from '@/hooks';
import { getMeterReadingsColumns } from '@/shared/constants/meters';
import { DEFAULT_PAGE_SIZE, DEFAULT_START_PAGE } from '@/shared/constants/table';
import { getUtilityMode, UtilityConfig, UtilityMode } from '@/shared/constants/utilities';
import { getCurrentTariff } from '@/shared/utils/meters/current-tariff';
import { useGetMeterReadingsQuery, useGetUtilityTariffsQuery } from '@/store/api/meters-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { cn } from '@/shared/utils/cn';
import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Plus, Settings2, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HouseMetersTableSkeleton } from '../skeletons/house-meters/HouseMetersTableSkeleton';
import { UtilityMetersTable } from './UtilityMetersTable';

type Props = {
  houseId: string;
  config: UtilityConfig;
};

const addButtonTextByMode: Record<UtilityMode, string> = {
  metered: 'Додати показник',
  'fixed-fee': 'Нарахувати місяць',
  manual: 'Записати суму',
};

const emptyStateByMode: Record<UtilityMode, { title: string; hint: string }> = {
  metered: {
    title: 'Ще немає показників.',
    hint: 'Додайте перший — він стане базовим для розрахунку споживання.',
  },
  'fixed-fee': {
    title: 'Ще немає нарахувань.',
    hint: 'Додайте перше нарахування — сума розрахується за чинним тарифом.',
  },
  manual: {
    title: 'Ще немає записів.',
    hint: 'Додайте перший запис — дата і сума з платіжки.',
  },
};

export const UtilityMetersCard = ({ houseId, config }: Props) => {
  const dispatch = useAppDispatch();

  const mode = getUtilityMode(config);
  const manualOnly = mode === 'manual';

  const [pageIndex, setPageIndex] = useState(DEFAULT_START_PAGE);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const {
    data: readingsData,
    isLoading: isReadingsLoading,
    isError,
    error,
  } = useGetMeterReadingsQuery({ houseId, utilityType: config.type });
  const { data: tariffs = [], isLoading: isTariffsLoading } = useGetUtilityTariffsQuery(
    config.type,
    { skip: manualOnly },
  );

  useToastOnError(isError, `Не вдалось завантажити дані: ${config.label}`, 'UtilityMetersCard');

  const readings = useMemo(() => readingsData?.data ?? [], [readingsData]);
  const currentTariff = getCurrentTariff(tariffs);
  const lastMeterReading =
    readings.find(reading => !reading.isManual && reading.value !== null) ?? null;
  const lastRecordDate = readings[0]?.readingDate ?? null;

  const columns = useMemo(() => getMeterReadingsColumns(houseId, config), [houseId, config]);

  const table = useReactTable({
    data: readings,
    columns,

    state: {
      pagination: {
        pageIndex,
        pageSize: limit,
      },
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex, pageSize: limit }) : updater;
      setPageIndex(next.pageIndex);
      setLimit(next.pageSize);
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onLimitChange = (nextLimit: number) => {
    setPageIndex(DEFAULT_START_PAGE);
    setLimit(nextLimit);
  };

  const handleAddReading = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.ADD_METER_READING,
        payload: {
          houseId,
          utilityType: config.type,
          metered: config.metered,
          allowManual: config.allowManual ?? false,
          manualOnly,
          unit: config.unit,
          label: config.label,
          lastReading: lastMeterReading
            ? { value: lastMeterReading.value, readingDate: lastMeterReading.readingDate }
            : null,
          lastRecordDate,
          lastAmount: readings[0]?.cost ?? null,
          tariffPrice: currentTariff?.pricePerUnit ?? null,
        },
      }),
    );
  };

  const handleManageTariff = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.MANAGE_TARIFF,
        payload: {
          utilityType: config.type,
          label: config.label,
          tariffUnitLabel: config.tariffUnitLabel,
        },
      }),
    );
  };

  const addButtonText = addButtonTextByMode[mode];
  const emptyState = emptyStateByMode[mode];
  const Icon = config.icon;

  if (isReadingsLoading || isTariffsLoading) return <HouseMetersTableSkeleton rows={5} />;
  if (isError) return <ErrorState className="w-full" error={error} />;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="sm:flex-col justify-start">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className={cn('shrink-0 rounded-xl p-2.5', config.softBgClass)}>
              <Icon size={22} className={config.colorClass} />
            </span>
            <div className="flex flex-col gap-1">
              <CardTitle>{config.label}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {!manualOnly && currentTariff && (
              <>
                <span
                  className={cn('rounded-full px-3 py-1 text-sm text-text', config.softBgClass)}
                >
                  Тариф: <span className="font-semibold">{currentTariff.pricePerUnit}</span>{' '}
                  {config.tariffUnitLabel}
                </span>
                <Button type="button" variant="outline" size="sm" onClick={handleManageTariff}>
                  <Settings2 size={16} className="mr-1" />
                  Змінити тариф
                </Button>
              </>
            )}
            <Button type="button" size="sm" onClick={handleAddReading}>
              <Plus size={16} className="mr-1" />
              {addButtonText}
            </Button>
          </div>
        </div>

        {!manualOnly && !currentTariff && (
          <div className="flex flex-col gap-2 rounded-md border border-info/40 bg-info/10 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-info">
              <TriangleAlert size={16} className="shrink-0" />
              Тариф не встановлено — додайте його, щоб бачити вартість.
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={handleManageTariff}
            >
              <Plus size={16} className="mr-1" />
              Додати тариф
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {readings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-muted-text">
            <span className={cn('rounded-full p-3', config.softBgClass)}>
              <Icon size={28} className={config.colorClass} />
            </span>
            <p className="font-medium">{emptyState.title}</p>
            <p className="text-sm text-muted-text">{emptyState.hint}</p>
          </div>
        ) : (
          <UtilityMetersTable
            table={table}
            config={config}
            limit={limit}
            onLimitChange={onLimitChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
