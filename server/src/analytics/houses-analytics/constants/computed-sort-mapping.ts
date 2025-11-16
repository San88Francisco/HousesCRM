import { HousePerformanceSortBy } from 'src/common/enums/house-performance-sort-by'
import { HousePerformanceDto } from '../dto/house-performance/house-performance.dto'

export type ComputedFieldKey = keyof Pick<HousePerformanceDto, 'rentersCount' | 'totalRevenue' | 'currentPayment'>

export type ComputedSortBy =
  | HousePerformanceSortBy.RENTERS_COUNT
  | HousePerformanceSortBy.TOTAL_REVENUE
  | HousePerformanceSortBy.CURRENT_PAYMENT

export const computedSortMapping: Record<ComputedSortBy, ComputedFieldKey> = {
  [HousePerformanceSortBy.RENTERS_COUNT]: 'rentersCount',
  [HousePerformanceSortBy.TOTAL_REVENUE]: 'totalRevenue',
  [HousePerformanceSortBy.CURRENT_PAYMENT]: 'currentPayment',
}

export const isComputedSort = (value: string): value is ComputedSortBy =>
  (Object.keys(computedSortMapping) as string[]).includes(value)
