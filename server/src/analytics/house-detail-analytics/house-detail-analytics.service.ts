import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'
import { HouseDetailAnalyticDto } from './dto/house-detail-analytic.dto'
import { HouseOccupancyQueryDto } from 'src/houses/dto/house-occupancy-query.dto'
import { HouseOccupancyReportResponseDto } from 'src/houses/dto/house-occupancy-report-response.dto'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { SortOrder } from 'src/common/enums/sort-order.enum'
import { HouseOccupancySortField } from 'src/houses/constants/house-occupancy-sort-field'

@Injectable()
export class HouseDetailAnalyticsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>
  ) {}

  async getHouseOccupancyReport(id: string): Promise<HouseDetailAnalyticDto[]> {
    return this.buildHouseOccupancyReport(id)
  }

  async getHouseOccupancyReportList(id: string, dto: HouseOccupancyQueryDto): Promise<HouseOccupancyReportResponseDto> {
    const report = await this.buildHouseOccupancyReport(id)
    const filtered = this.applyFilters(report, dto)
    const sorted = this.applySorting(filtered, dto)

    const page = dto.page ?? QUERY_DEFAULTS.PAGE
    const limit = dto.limit ?? QUERY_DEFAULTS.LIMIT
    const total = sorted.length
    const start = (page - 1) * limit
    const data = sorted.slice(start, start + limit)

    return plainToInstance(
      HouseOccupancyReportResponseDto,
      {
        data,
        meta: {
          total,
          page,
          limit,
        },
      },
      { excludeExtraneousValues: true }
    )
  }

  private async buildHouseOccupancyReport(id: string): Promise<HouseDetailAnalyticDto[]> {
    const contractsByHouseId = await this.contractsRepository.find({
      where: { house: { id } },
      relations: { renter: true },
    })

    return plainToInstance(HouseDetailAnalyticDto, aggregateOccupancyReports(contractsByHouseId), {
      excludeExtraneousValues: true,
    })
  }

  private applyFilters(report: HouseDetailAnalyticDto[], dto: HouseOccupancyQueryDto): HouseDetailAnalyticDto[] {
    const { id, renterName, occupiedFrom, occupiedTo, vacatedFrom, vacatedTo, minTotalIncome, maxTotalIncome, status } =
      dto

    const renterNameSearch = renterName?.toLowerCase()

    return report.filter((item) => {
      if (id && item.id !== id) {
        return false
      }

      if (renterNameSearch) {
        const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`
        if (!this.matchesText(fullName, renterNameSearch)) {
          return false
        }
      }

      if ((occupiedFrom || occupiedTo) && !this.inDateRange(item.occupied, occupiedFrom, occupiedTo)) {
        return false
      }

      if ((vacatedFrom || vacatedTo) && !this.inDateRange(item.vacated, vacatedFrom, vacatedTo)) {
        return false
      }

      if (
        (minTotalIncome !== undefined || maxTotalIncome !== undefined) &&
        !this.inNumberRange(item.totalIncome, minTotalIncome, maxTotalIncome)
      ) {
        return false
      }

      if (status && item.status !== status) {
        return false
      }

      return true
    })
  }

  private applySorting(report: HouseDetailAnalyticDto[], dto: HouseOccupancyQueryDto): HouseDetailAnalyticDto[] {
    const sortField = dto.sortBy ?? HouseOccupancySortField.TOTAL_INCOME
    const direction = dto.order === SortOrder.ASC ? 1 : -1

    const withNullsLast =
      <T>(compare: (a: T, b: T) => number) =>
      (a: T | null | undefined, b: T | null | undefined): number => {
        const aIsNull = a === null || a === undefined
        const bIsNull = b === null || b === undefined

        if (aIsNull && bIsNull) {
          return 0
        }
        if (aIsNull) {
          return 1
        }
        if (bIsNull) {
          return -1
        }

        return compare(a as T, b as T)
      }

    let comparator: (a: HouseDetailAnalyticDto, b: HouseDetailAnalyticDto) => number

    switch (sortField) {
      case HouseOccupancySortField.RENTER_NAME: {
        const getValue = (item: HouseDetailAnalyticDto): string | null => {
          const fullName = `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim()
          return fullName ? fullName.toLowerCase() : null
        }

        const compareStrings = withNullsLast<string>((a, b) => a.localeCompare(b))
        comparator = (a, b) => compareStrings(getValue(a), getValue(b)) * direction
        break
      }

      case HouseOccupancySortField.FIRST_NAME:
      case HouseOccupancySortField.LAST_NAME:
      case HouseOccupancySortField.ID: {
        const getValue = (item: HouseDetailAnalyticDto): string | null => {
          const value = item[sortField]
          return value ? String(value).toLowerCase() : null
        }

        const compareStrings = withNullsLast<string>((a, b) => a.localeCompare(b))
        comparator = (a, b) => compareStrings(getValue(a), getValue(b)) * direction
        break
      }

      case HouseOccupancySortField.OCCUPIED:
      case HouseOccupancySortField.VACATED: {
        const getValue = (item: HouseDetailAnalyticDto): number | null => {
          const value = item[sortField]
          if (!value) {
            return null
          }

          if (value instanceof Date) {
            return value.getTime()
          }

          const parsed = new Date(value as string)
          const time = parsed.getTime()
          return Number.isNaN(time) ? null : time
        }

        const compareNumbers = withNullsLast<number>((a, b) => a - b)
        comparator = (a, b) => compareNumbers(getValue(a), getValue(b)) * direction
        break
      }

      case HouseOccupancySortField.TOTAL_INCOME:
      default: {
        const getValue = (item: HouseDetailAnalyticDto): number | null => {
          const value = item[sortField]
          if (value === null || value === undefined) {
            return null
          }
          if (typeof value === 'number') {
            return value
          }

          const num = Number(value)
          return Number.isNaN(num) ? null : num
        }

        const compareNumbers = withNullsLast<number>((a, b) => a - b)
        comparator = (a, b) => compareNumbers(getValue(a), getValue(b)) * direction
        break
      }
    }

    return [...report].sort(comparator)
  }

  private matchesText(value: string | null | undefined, search?: string): boolean {
    if (!search) {
      return true
    }
    if (!value) {
      return false
    }
    return value.toLowerCase().includes(search)
  }

  private inDateRange(value: Date | null | undefined, from?: Date, to?: Date): boolean {
    if (!value) {
      return false
    }
    if (from && value < from) {
      return false
    }
    if (to && value > to) {
      return false
    }
    return true
  }

  private inNumberRange(value: number | null | undefined, min?: number, max?: number): boolean {
    if (value === null || value === undefined) {
      return false
    }
    if (min !== undefined && value < min) {
      return false
    }
    if (max !== undefined && value > max) {
      return false
    }
    return true
  }
}
