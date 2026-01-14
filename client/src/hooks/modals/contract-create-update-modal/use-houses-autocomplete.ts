import { useGetAllHousesAutocompleteQuery } from '@/store/api/lazy-loading-autocomplete';
import { House } from '@/types/core/house';
import { useEntityAutocomplete } from './use-entity-autocomplete';

export const useHousesAutocomplete = () => {
  return useEntityAutocomplete<House>({
    entityType: 'houses',
    useListQuery: useGetAllHousesAutocompleteQuery,
    formatOption: house => ({
      value: house.id,
      label: `${house.apartmentName} - ${house.street}`,
      disabled: false,
    }),
  });
};
