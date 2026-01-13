import { getStatusLabel } from '@/shared/utils/create-update-contract-form/status-labels';
import { useGetAllRentersQuery } from '@/store/api/paginated-api';
import { Renter } from '@/types/core/renter';
import { useEntityAutocomplete } from './use-entity-autocomplete';

export const useRentersAutocomplete = () => {
  return useEntityAutocomplete<Renter>({
    entityType: 'renters',
    useListQuery: useGetAllRentersQuery,
    formatOption: renter => ({
      value: renter.id,
      label: `${renter.firstName} ${renter.lastName} - ${getStatusLabel(renter.status)}`,
      disabled: false,
    }),
  });
};
