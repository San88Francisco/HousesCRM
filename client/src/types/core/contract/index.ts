import { House } from '../house';
import { Renter } from '../renter';
import { ContractStatus } from '../status';

export interface Contract {
  id: string;
  commencement: string;
  termination: string;
  monthlyPayment: number;
  status: ContractStatus;
}

export interface ContractWithRevenue extends Contract {
  totalRevenue: number;
}

export interface ContractCreateUpdate extends Contract {
  houseId?: string;
  renterId?: string;
  house?: House;
  renter?: Renter;
}
