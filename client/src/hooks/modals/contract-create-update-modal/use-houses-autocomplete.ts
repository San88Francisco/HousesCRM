import { useGetAllHousesQuery } from '@/store/api/paginated-api';
import { House } from '@/types/core/house';
import { useEntityAutocomplete } from './use-entity-autocomplete';

export const useHousesAutocomplete = () => {
  return useEntityAutocomplete<House>({
    entityType: 'houses',
    useListQuery: useGetAllHousesQuery,
    formatOption: house => ({
      value: house.id,
      label: `${house.apartmentName} - ${house.street}`,
      disabled: false,
    }),
  });
};
