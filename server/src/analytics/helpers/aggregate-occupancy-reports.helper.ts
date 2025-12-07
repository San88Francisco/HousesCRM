import type { Contract } from 'src/contracts/entities/contract.entity'
import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { HouseDetailAnalyticDto } from '../house-detail-analytics/dto/house-detail-analytic.dto'
import { calculateContractRevenue } from './revenue.helpers'

export const aggregateOccupancyReports = (contracts: Contract[]): HouseDetailAnalyticDto[] => {
  const occupancyReport = contracts.reduce<Record<string, HouseDetailAnalyticDto>>((acc, contract) => {
    const renterId = contract.renter.id

    if (!acc[renterId]) {
      acc[renterId] = {
        id: renterId,
        firstName: contract.renter.firstName,
        lastName: contract.renter.lastName,
        occupied: contract.renter.occupied,
        vacated: contract.renter.vacated,
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
