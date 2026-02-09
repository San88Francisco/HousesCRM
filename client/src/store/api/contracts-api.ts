import { rootApi } from '@/shared/api';
import { ContractsRequest, ContractsResponse } from '@/types/core/contract';
import { PdfContractRaw } from '@/types/services/contracts';

export const contractsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getContractPdf: build.query<PdfContractRaw, string>({
      query: (id: string) => `/contracts/${id}/pdf-file`,
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

export const { useLazyGetContractPdfQuery, useGetContractsQuery } = contractsApi;
