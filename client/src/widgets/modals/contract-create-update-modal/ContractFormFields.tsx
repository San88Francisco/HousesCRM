import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { RHFDateRangePicker } from '@/components/RHF/RHFDateRangePicker';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFSelect } from '@/components/RHF/RHFSelect';
import { useHousesAutocomplete } from '@/hooks/modals/contract-create-update-modal/use-houses-autocomplete';
import { useRentersAutocomplete } from '@/hooks/modals/contract-create-update-modal/use-renters-autocomplete';
import { statusOptions } from '@/shared/utils/create-update-contract-form/status-options';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { Building, Coins, User } from 'lucide-react';

type Props = {
  isLoading: boolean;
  initialHouse?: House | null;
  initialRenter?: Renter | null;
};

export const ContractFormFields = ({ isLoading, initialHouse, initialRenter }: Props) => {
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

      <div className="col-span-1 md:col-span-2">
        <RHFDateRangePicker
          startName="commencement"
          endName="termination"
          startLabel="Дата початку"
          endLabel="Дата завершення"
          startPlaceholder="Оберіть дату початку"
          endPlaceholder="Оберіть дату завершення"
          disabled={isLoading}
          ariaRequired
        />
      </div>

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
    </div>
  );
};
