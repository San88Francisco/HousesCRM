import { Contract } from 'src/contracts/entities/contract.entity'
import { House } from 'src/houses/entities/house.entity'
import {
  RevenueDistributionDto,
  RevenueDistributionItemDto,
} from '../houses-analytics/dto/revenue-distribution/revenue-distribution.dto'

export const calculateMonthsBetween = (start: Date, end: Date): number => {
  const startYear = start.getFullYear()
  const startMonth = start.getMonth()
  const endYear = end.getFullYear()
  const endMonth = end.getMonth()

  const months = (endYear - startYear) * 12 + (endMonth - startMonth)

  return Math.max(months, 0)
}

export const calculateContractRevenue = (contract: Contract): number => {
  const months = calculateMonthsBetween(contract.commencement, contract.termination)
  return months * contract.monthlyPayment
}

export const calculateHouseRevenue = (house: House): Omit<RevenueDistributionItemDto, 'percentage'> => {
  const apartmentTotalRevenue =
    house.contracts?.reduce((sum, contract) => {
      return sum + calculateContractRevenue(contract)
    }, 0) || 0

  return {
    id: house.id,
    apartmentName: house.apartmentName,
    apartmentTotalRevenue,
  }
}

export const calculateRevenuePercentages = (
  housesRevenue: Array<Omit<RevenueDistributionItemDto, 'percentage'>>
): RevenueDistributionDto => {
  const grandTotal = housesRevenue.reduce((sum, house) => sum + house.apartmentTotalRevenue, 0)

  const data = housesRevenue.map((house) => ({
    ...house,
    percentage: grandTotal > 0 ? +((house.apartmentTotalRevenue * 100) / grandTotal).toFixed(2) : 0,
  }))

  return { data, grandTotal }
}
