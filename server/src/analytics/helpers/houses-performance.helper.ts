import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { House } from 'src/houses/entities/house.entity'
import { calculateHouseRevenue } from './revenue.helpers'
import { HousePerformanceBase } from '../types/analytics.types'

export const housesPerformance = (houses: House[]): HousePerformanceBase[] => {
  return houses.map((house): HousePerformanceBase => {
    const houseRevenue = calculateHouseRevenue(house)
    const totalUniqueRenters = new Set(house.contracts.map(({ renter }) => renter?.id).filter((id) => id))
    const activeContract = house.contracts.find(({ status }) => status === ContractStatus.ACTIVE)
    const currentPayment = activeContract ? activeContract.monthlyPayment : 0

    return {
      apartmentName: house.apartmentName,
      rentersCount: totalUniqueRenters.size,
      totalRevenue: houseRevenue.apartmentTotalRevenue,
      currentPayment,
    }
  })
}
