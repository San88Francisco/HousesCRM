import { rootApi } from '@/shared/api';
import { PdfContractRaw } from '@/types/services/contracts';

export const contractsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getContractPdf: build.query<PdfContractRaw, string>({
      query: (id: string) => `/contracts/${id}/pdf-file`,
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetContractPdfQuery } = contractsApi;
