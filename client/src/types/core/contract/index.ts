import { ContractStatus } from '../status/status';

export interface Contract {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
}

// export type Contract = {
//   id: string;
//   commencement: string;
//   termination: string;
//   monthlyPayment: number;
//   renter: Renter;
// };
