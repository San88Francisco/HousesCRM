import type { Contract } from 'src/contracts/entities/contract.entity'
import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { RenterDto } from 'src/renters/dto/renter.dto'
import type { Renter } from 'src/renters/entities/renter.entity'
import { calculateContractRevenue } from './revenue.helpers'

function isLoadedRenter(renter: Contract['renter'] | undefined): renter is Renter & { id: string } {
  return renter !== undefined && renter !== null && typeof renter.id === 'string' && renter.id.length > 0
}

type AccRow = {
  id: string
  firstName: string
  lastName: string
  age: number
  occupied: Date | null
  vacated: Date | null
  status: ContractStatus
  totalIncome: number
  contracts: Contract[]
}

function pickRepresentativeContractId(contracts: Contract[]): string | undefined {
  if (contracts.length === 0) {
    return undefined
  }
  const active = contracts
    .filter((c) => c.status === ContractStatus.ACTIVE)
    .sort((a, b) => b.commencement.getTime() - a.commencement.getTime())
  if (active[0]) {
    return active[0].id
  }
  const sorted = [...contracts].sort((a, b) => b.commencement.getTime() - a.commencement.getTime())
  return sorted[0]?.id
}

export const aggregateOccupancyReports = (contracts: Contract[]): RenterDto[] => {
  const acc: Record<string, AccRow> = {}

  for (const contract of contracts) {
    if (!isLoadedRenter(contract.renter)) {
      continue
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
        contracts: [],
      }
    }

    acc[renterId].contracts.push(contract)
    acc[renterId].totalIncome += calculateContractRevenue(contract)

    if (contract.status === ContractStatus.ACTIVE) {
      acc[renterId].status = ContractStatus.ACTIVE
    } else if (acc[renterId].status !== ContractStatus.ACTIVE) {
      acc[renterId].status = contract.status ?? ContractStatus.INACTIVE
    }
  }

  return Object.values(acc).map((row) => {
    const { contracts: rowContracts, ...rest } = row
    return {
      ...rest,
      contractId: pickRepresentativeContractId(rowContracts),
    } as RenterDto
  })
}
