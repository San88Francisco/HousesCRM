import { House } from '../house';
import { Renter } from '../renter';
import { ContractStatus } from '../status/status';

export interface Contract {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
}
export interface ContractCreateUpdate {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
  houseId?: string;
  renterId?: string;
  house?: House;
  renter?: Renter;
}
