import { getStatusLabel } from '@/shared/utils/create-update-contract-form/status-labels';
import { useGetAllRentersAutocompleteQuery } from '@/store/api/lazy-loading-autocomplete';
import { Renter } from '@/types/core/renter';
import { useEntityAutocomplete } from './use-entity-autocomplete';

export const useRentersAutocomplete = () => {
  return useEntityAutocomplete<Renter>({
    entityType: 'renters',
    useListQuery: useGetAllRentersAutocompleteQuery,
    formatOption: renter => ({
      value: renter.id,
      label: `${renter.firstName} ${renter.lastName} - ${getStatusLabel(renter.status)}`,
      disabled: false,
    }),
  });
};
