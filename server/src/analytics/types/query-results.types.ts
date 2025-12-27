import { Contract } from 'src/contracts/entities/contract.entity'
import { Renter } from 'src/renters/entities/renter.entity'

export type HouseWithContractArray = {
  id: string
  apartmentName: string
  contract?: Array<ContractWithRenter>
}

export type ContractWithRenter = Contract & {
  renter?: Renter
}

export type RevenueDistributionItem = {
  id: string
  apartmentName: string
  apartmentTotalRevenue: number
  percentage: number
}
