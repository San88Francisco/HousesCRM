// import { rootApi } from '@/shared/api';
// import { ContractsForPeriodRequest, ContractsForPeriodResponse } from '@/types/services/contracts';

// export const contractsApi = rootApi.injectEndpoints({
//   endpoints: build => ({
//     getAllContracts: build.query<ContractsForPeriodResponse, ContractsForPeriodRequest>({
//       query: ({ period, renter_id }) => ({
//         url: `/contracts/deals`,
//         params: { period, renter_id },
//       }),
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetAllContractsQuery } = contractsApi;
