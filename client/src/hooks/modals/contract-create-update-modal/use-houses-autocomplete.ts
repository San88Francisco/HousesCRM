import { useGetHousesAutocompleteQuery } from '@/store/api/lazy-loading-autocomplete';
import { House } from '@/types/core/house';
import { useEntityAutocomplete } from './use-entity-autocomplete';

type Props = {
  initialHouse?: House | null;
};

export const useHousesAutocomplete = ({ initialHouse }: Props = {}) => {
  return useEntityAutocomplete<House>({
    entityType: 'houses',
    useListQuery: useGetHousesAutocompleteQuery,
    formatOption: house => ({
      value: house.id,
      label: `${house.apartmentName} - ${house.street}`,
      disabled: false,
    }),
    initialEntity: initialHouse,
  });
};
