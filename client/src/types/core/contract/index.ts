import { UUID } from 'crypto';
import { ContractStatus } from '../status/status';

export interface Contract {
  id: UUID;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
}
