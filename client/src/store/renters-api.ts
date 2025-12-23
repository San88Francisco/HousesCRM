import { rootApi } from '@/shared/api';
import { AllContractsByRenterIdResponse } from '@/types/services/renters';

export const rentersApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllContractsByRenterId: build.query<AllContractsByRenterIdResponse, string>({
      query: renter_id => `/renters/${renter_id}`,
      providesTags: (_result, _error, id) => [{ type: 'Renters', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllContractsByRenterIdQuery } = rentersApi;
