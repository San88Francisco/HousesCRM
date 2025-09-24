import { House } from 'src/houses/entities/house.entity'
import { HousePerformanceDto } from '../dto/house-performance/house-performance.dto'
import { calculateHouseRevenue } from './revenue.helpers'
import { ContractStatus } from 'src/contracts/entities/contract.entity'

export const housesPerformance = (houses: House[]): HousePerformanceDto[] => {
  return houses.map((house): HousePerformanceDto => {
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
