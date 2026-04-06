import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { RHFDateRangePicker } from '@/components/RHF/RHFDateRangePicker';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFSelect } from '@/components/RHF/RHFSelect';
import {
  useHousesAutocomplete,
  useRentersAutocomplete,
} from '@/hooks/modals/contract-create-update-modal';
import { statusOptions } from '@/shared/utils/create-update-contract-form/status-options';
import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractStatus } from '@/types/core/status';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { Building, Coins, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

type Props = {
  isLoading: boolean;
  initialHouse?: House | null;
  initialRenter?: Renter | null;
};

export const ContractFormFields = ({ isLoading, initialHouse, initialRenter }: Props) => {
  const { setValue } = useFormContext<ContractFormData>();
  const status = useWatch<ContractFormData, 'status'>({ name: 'status' });
  const isActive = status === ContractStatus.ACTIVE;
  const prevStatusRef = useRef<ContractStatus | null>(null);

  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    if (status !== ContractStatus.ACTIVE) return;

    if (prev === ContractStatus.INACTIVE) {
      setValue('termination', null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    if (prev === null) {
      setValue('termination', null, { shouldValidate: true, shouldDirty: false });
    }
  }, [status, setValue]);

  const {
    options: houseOptions,
    isFetching: isHousesFetching,
    hasMore: hasMoreHouses,
    loadMoreRef: housesLoadMoreRef,
    handleSearch: handleHouseSearch,
    handleOpenChange: handleHouseOpenChange,
  } = useHousesAutocomplete({ initialHouse });

  const {
    options: renterOptions,
    isFetching: isRentersFetching,
    hasMore: hasMoreRenters,
    loadMoreRef: rentersLoadMoreRef,
    handleSearch: handleRenterSearch,
    handleOpenChange: handleRenterOpenChange,
  } = useRentersAutocomplete({ initialRenter });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RHFAutocomplete
        name="houseId"
        label="Будинок"
        placeholder="Оберіть будинок"
        searchPlaceholder="Пошук будинку..."
        emptyMessage="Будинки не знайдені"
        icon={<Building className="w-4 h-4" />}
        iconWithError
        options={houseOptions}
        onSearch={handleHouseSearch}
        onOpenChange={handleHouseOpenChange}
        loading={isHousesFetching}
        disabled={isLoading}
        hasMore={hasMoreHouses}
        loadMoreRef={housesLoadMoreRef}
        required
      />

      <RHFAutocomplete
        name="renterId"
        label="Орендар"
        placeholder="Оберіть орендаря"
        searchPlaceholder="Пошук орендаря..."
        emptyMessage="Орендарі не знайдені"
        icon={<User className="w-4 h-4" />}
        iconWithError
        options={renterOptions}
        onSearch={handleRenterSearch}
        onOpenChange={handleRenterOpenChange}
        loading={isRentersFetching}
        disabled={isLoading}
        hasMore={hasMoreRenters}
        loadMoreRef={rentersLoadMoreRef}
        required
      />

      <RHFSelect
        name="status"
        label="Статус контракту"
        placeholder="Оберіть статус"
        options={statusOptions}
        disabled={isLoading}
      />

      <RHFInput
        name="monthlyPayment"
        type="number"
        label="Щомісячна оплата"
        placeholder="5000"
        icon={<Coins className="w-4 h-4" />}
        required
        min={1}
        disabled={isLoading}
      />

      <div className="col-span-1 md:col-span-2">
        <RHFDateRangePicker
          startName="commencement"
          endName="termination"
          startLabel="Дата початку"
          endLabel="Дата завершення"
          startPlaceholder="Оберіть дату початку"
          endPlaceholder={isActive ? 'Наразі орендує' : 'Оберіть дату завершення'}
          disabled={isLoading}
          endDisabled={isActive}
          ariaRequired
        />
      </div>
    </div>
  );
};
