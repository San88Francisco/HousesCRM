import type { Contract } from 'src/contracts/entities/contract.entity'
import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { RenterDto } from 'src/renters/dto/renter.dto'
import type { Renter } from 'src/renters/entities/renter.entity'
import { calculateContractRevenue } from './revenue.helpers'

function isLoadedRenter(renter: Contract['renter'] | undefined): renter is Renter & { id: string } {
  return renter !== undefined && renter !== null && typeof renter.id === 'string' && renter.id.length > 0
}

export const aggregateOccupancyReports = (contracts: Contract[]): RenterDto[] => {
  const occupancyReport = contracts.reduce<Record<string, RenterDto>>((acc, contract) => {
    if (!isLoadedRenter(contract.renter)) {
      return acc
    }
    const renter = contract.renter
    const renterId = renter.id

    if (!acc[renterId]) {
      acc[renterId] = {
        id: renterId,
        firstName: renter.firstName ?? '',
        lastName: renter.lastName ?? '',
        age: renter.age ?? 0,
        occupied: renter.occupied ?? null,
        vacated: renter.vacated ?? null,
        status: contract.status,
        totalIncome: 0,
      }
    }

    acc[renterId].totalIncome += calculateContractRevenue(contract)

    if (contract.status === ContractStatus.ACTIVE) {
      acc[renterId].status = ContractStatus.ACTIVE
    } else if (acc[renterId].status !== ContractStatus.ACTIVE) {
      acc[renterId].status = contract.status ?? ContractStatus.INACTIVE
    }

    return acc
  }, {})

  return Object.values(occupancyReport)
}
