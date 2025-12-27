import { House } from 'src/houses/entities/house.entity'
import { Contract } from 'src/contracts/entities/contract.entity'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'

export type HouseWithContracts = House & {
  contracts: Contract[]
}

export type HouseWithPrices = House & {
  prices: AmountInCurrencyDto[]
}

export type RevenueDistributionItemBase = {
  id: string
  apartmentName: string
  apartmentTotalRevenue: number
}

export type RevenueDistributionItemWithCurrencies = RevenueDistributionItemBase & {
  apartmentTotalRevenueInCurrencies: AmountInCurrencyDto[]
  percentage: number
}

export type RevenueDistributionBase = {
  data: Array<RevenueDistributionItemBase & { percentage: number }>
  grandTotal: number
}

export type HousePerformanceBase = {
  apartmentName: string
  rentersCount: number
  totalRevenue: number
  currentPayment: number
}

export type HousePerformanceWithCurrencies = HousePerformanceBase & {
  totalRevenueInCurrencies: AmountInCurrencyDto[]
  currentPaymentInCurrencies: AmountInCurrencyDto[]
}

export type PaybackStatsBase = {
  id: string
  apartmentName: string
  purchaseDate: Date
  purchasePrice: number
  totalIncome: number
  paybackCoefficient: number
}
