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
      transformResponse: (raw: unknown): PdfContractResponse => {
        const r = raw as Partial<PdfContractResponse>;
        return {
          renterFirstName: String(r.renterFirstName ?? ''),
          renterLastName: String(r.renterLastName ?? ''),
          roomsCount: Number(r.roomsCount ?? 0) || 0,
          totalArea: Number(r.totalArea ?? 0) || 0,
          street: String(r.street ?? ''),
          apartmentName: String(r.apartmentName ?? ''),
          commencement:
            typeof r.commencement === 'string' ? r.commencement : String(r.commencement ?? ''),
          monthlyPayment: Number(r.monthlyPayment ?? 0) || 0,
        };
      },
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
        'Contracts',
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
    deleteContract: build.mutation<void, string>({
      query: id => ({
        url: `/contracts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Contracts', id },
        'Contracts',
        'Analytics',
        'Houses',
        'Renters',
      ],
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
  useLazyGetContractByIdQuery,
  useGetContractByIdQuery,
  useUpdateContractMutation,
  useCreateContractMutation,
  useDeleteContractMutation,
  useGetContractsQuery,
} = contractsApi;
