import { getStatusLabel } from '@/shared/utils/create-update-contract-form/status-labels';
import { useGetRentersAutocompleteQuery } from '@/store/api/lazy-loading-autocomplete';
import { Renter } from '@/types/core/renter';
import { useEntityAutocomplete } from './use-entity-autocomplete';

type Props = {
  initialRenter?: Renter | null;
};

export const useRentersAutocomplete = ({ initialRenter }: Props = {}) => {
  return useEntityAutocomplete<Renter>({
    entityType: 'renters',
    useListQuery: useGetRentersAutocompleteQuery,
    formatOption: renter => ({
      value: renter.id,
      label: `${renter.firstName} ${renter.lastName} - ${getStatusLabel(renter.status)}`,
      disabled: false,
    }),
    initialEntity: initialRenter,
  });
};
