import { Contract } from 'src/contracts/entities/contract.entity'
import { House } from 'src/houses/entities/house.entity'
import { calculateMonthsBetween } from './revenue.helpers'
import { PaybackStatsBase } from '../types/analytics.types'

const calculateContractTotalIncome = (contract: Contract): number => {
  const months = calculateMonthsBetween(contract.commencement, contract.termination)
  return months * contract.monthlyPayment
}

const calculateHousePaybackStats = (house: House): PaybackStatsBase => {
  const purchasePrice = house.price
  const totalIncome = house.contracts.reduce((sum, contract) => {
    return sum + calculateContractTotalIncome(contract)
  }, 0)

  const paybackCoefficient = purchasePrice > 0 ? totalIncome / purchasePrice : 0

  return {
    id: house.id,
    apartmentName: house.apartmentName,
    purchaseDate: house.purchaseDate,
    purchasePrice,
    totalIncome,
    paybackCoefficient,
  }
}

export const calculatePaybackStatsForHouses = (houses: House[]): PaybackStatsBase[] => {
  return houses.map(calculateHousePaybackStats)
}
