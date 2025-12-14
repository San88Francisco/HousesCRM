import { rootApi } from '@/shared/api';
import {
  ContractsForPeriodRequest,
  ContractsForPeriodResponse,
  PdfContractRaw,
} from '@/types/services/contracts';

export const contractsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllContracts: build.query<ContractsForPeriodResponse, ContractsForPeriodRequest>({
      query: ({ period, renter_id }) => ({
        url: `/contracts/deals`,
        params: { period, renter_id },
      }),
    }),
    getContractPdf: build.query<PdfContractRaw, string>({
      query: (id: string) => `/contracts/${id}/pdf-file`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllContractsQuery, useLazyGetContractPdfQuery } = contractsApi;
