import { Contract } from 'src/contracts/entities/contract.entity'
import { calculateMonthsBetween } from './revenue.helpers'
import { House } from 'src/houses/entities/house.entity'
import { HousePaybackStatsDto } from '../houses-analytics/dto/house-payback-stats/house-payback-stats.dto'
import { CurrencyCode } from 'src/house-prices/entities/house-price.entity'

const calculateContractTotalIncomeUSD = (contract: Contract): number => {
  const months = calculateMonthsBetween(contract.commencement, contract.termination)
  return months * contract.monthlyPayment
}

const normalizeHousesContractsToUSD = (houses: House[]): House[] => {
  return houses.map((house) => {
    const { prices, contracts } = house
    const usdPrice = prices.find((price) => price.code === CurrencyCode.USD)

    if (!usdPrice) {
      throw new Error(`USD price not found for house ${house.id}`)
    }

    const normalizedContracts = contracts.map((contract) => {
      const monthlyPaymentUSD = contract.monthlyPayment / Number(usdPrice.exchangeRate)

      const totalIncomeUSD = calculateContractTotalIncomeUSD({
        ...contract,
        monthlyPayment: monthlyPaymentUSD,
      })

      return {
        ...contract,
        monthlyPayment: monthlyPaymentUSD,
        totalIncomeUSD,
      }
    })

    return {
      ...house,
      contracts: normalizedContracts,
    }
  })
}

const calculateHousePaybackStats = (house: House): HousePaybackStatsDto => {
  const usdPrice = house.prices.find((price) => price.code === CurrencyCode.USD)
  if (!usdPrice) {
    throw new Error(`USD price not found for house ${house.id}`)
  }

  const purchasePriceUSD = Number(usdPrice.amount)

  const totalIncomeUSD: number = house.contracts.reduce((sum, contract: Contract & { totalIncomeUSD: number }) => {
    return sum + contract.totalIncomeUSD
  }, 0)

  const paybackCoefficient = purchasePriceUSD > 0 ? totalIncomeUSD / purchasePriceUSD : 0

  return {
    ...house,
    purchasePriceUSD,
    totalIncomeUSD,
    paybackCoefficient,
  }
}

export const calculatePaybackStatsForHouses = (houses: House[]): HousePaybackStatsDto[] => {
  return normalizeHousesContractsToUSD(houses).map(calculateHousePaybackStats)
}
