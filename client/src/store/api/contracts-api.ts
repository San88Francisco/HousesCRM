import { rootApi } from '@/shared/api';
import { ContractsRequest, ContractsResponse } from '@/types/core/contract';
import {
  ContractByIdResponse,
  CreateContractRequest,
  CreateContractResponse,
  PdfContractResponse,
  UpdateContractRequest,
  UpdateContractResponse,
} from '@/types/services/contracts';

export const contractsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getContractPdf: build.query<PdfContractResponse, string>({
      query: (id: string) => `/contracts/${id}/pdf-file`,
    }),
    getContractById: build.query<ContractByIdResponse, string>({
      query: id => `/contracts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Contracts', id }],
    }),
    updateContract: build.mutation<UpdateContractResponse, UpdateContractRequest>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contracts', id },
        'Analytics',
        'Houses',
        'Renters',
      ],
    }),
    createContract: build.mutation<CreateContractResponse, CreateContractRequest>({
      query: body => ({
        url: '/contracts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contracts', 'Analytics', 'Houses', 'Renters'],
    }),
    getContracts: build.query<ContractsResponse, ContractsRequest>({
      query: ({ page, limit, sortBy, order }) => ({
        url: '/contracts',
        method: 'GET',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),
      providesTags: ['Contracts'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetContractPdfQuery,
  useGetContractByIdQuery,
  useUpdateContractMutation,
  useCreateContractMutation,
  useGetContractsQuery,
} = contractsApi;
