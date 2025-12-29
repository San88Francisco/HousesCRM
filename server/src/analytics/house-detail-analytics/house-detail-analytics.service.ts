import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract } from 'src/contracts/entities/contract.entity'
import { HouseOccupancyQueryDto } from 'src/houses/dto/house-occupancy-query.dto'
import { HouseOccupancyReportResponseDto } from 'src/houses/dto/house-occupancy-report-response.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { Renter } from 'src/renters/entities/renter.entity'
import { Repository } from 'typeorm'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'

@Injectable()
export class HouseDetailAnalyticsService {
  private readonly validSortableFields: string[] = ['firstName', 'lastName', 'occupied', 'vacated']

  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>
  ) {}

  async getHouseOccupancyReport(id: string): Promise<RenterDto[]> {
    return this.buildHouseOccupancyReport(id)
  }

  async getHouseOccupancyReportList(id: string, dto: HouseOccupancyQueryDto): Promise<HouseOccupancyReportResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = 'totalIncome',
    } = dto

    if (sortBy === 'totalIncome' || sortBy === 'status') {
      return this.getHouseOccupancyReportSortedInMemory(id, page, limit, order, sortBy)
    }

    const orderField = this.validSortableFields.includes(sortBy) ? sortBy : 'firstName'

    const totalRenters = await this.contractsRepository
      .createQueryBuilder('contract')
      .select('COUNT(DISTINCT contract.renterId)', 'count')
      .where('contract.houseId = :id', { id })
      .getRawOne<{ count: string }>()

    const total = parseInt(totalRenters?.count ?? '0', 10)

    if (total === 0) {
      return plainToInstance(
        HouseOccupancyReportResponseDto,
        { data: [], meta: { total: 0, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const subQuery = this.rentersRepository
      .createQueryBuilder('sub')
      .select('sub.id', 'id')
      .addSelect(`sub.${orderField}`, 'orderField')
      .innerJoin('sub.contracts', 'contract')
      .where('contract.houseId = :id', { id })
      .groupBy('sub.id')
      .addGroupBy(`sub.${orderField}`)
      .orderBy(`sub.${orderField}`, order)
      .limit(limit)
      .offset((page - 1) * limit)

    const renterIds = await subQuery.getRawMany<{ id: string }>()
    const ids = renterIds.map((r) => r.id)

    if (ids.length === 0) {
      return plainToInstance(
        HouseOccupancyReportResponseDto,
        { data: [], meta: { total, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const contracts = await this.contractsRepository
      .createQueryBuilder('contract')
      .innerJoinAndSelect('contract.renter', 'renter')
      .where('contract.renterId IN (:...ids)', { ids })
      .andWhere('contract.houseId = :id', { id })
      .orderBy(`renter.${orderField}`, order)
      .getMany()

    const rentersData = aggregateOccupancyReports(contracts)

    const orderedIds = contracts.map((c) => c.renter.id)
    const seen = new Set<string>()
    const uniqueOrderedIds = orderedIds.filter((id) => {
      if (seen.has(id)) {
        return false
      }
      seen.add(id)
      return true
    })

    const orderMap = new Map(uniqueOrderedIds.map((id, index) => [id, index]))
    rentersData.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))

    const data = plainToInstance(RenterDto, rentersData, { excludeExtraneousValues: true })

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

  private async getHouseOccupancyReportSortedInMemory(
    id: string,
    page: number,
    limit: number,
    order: string,
    sortBy: string
  ): Promise<HouseOccupancyReportResponseDto> {
    const contracts = await this.contractsRepository.find({
      where: { house: { id } },
      relations: { renter: true },
    })

    const rentersData = aggregateOccupancyReports(contracts)

    rentersData.sort((a, b) => {
      const aValue = a[sortBy as keyof RenterDto]
      const bValue = b[sortBy as keyof RenterDto]

      if (aValue === null || aValue === undefined) {
        return 1
      }
      if (bValue === null || bValue === undefined) {
        return -1
      }

      const diff =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue))

      return order === 'ASC' ? diff : -diff
    })

    const total = rentersData.length
    const startIndex = (page - 1) * limit
    const paginatedRenters = rentersData.slice(startIndex, startIndex + limit)

    const data = plainToInstance(RenterDto, paginatedRenters, { excludeExtraneousValues: true })

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

  private async buildHouseOccupancyReport(id: string): Promise<RenterDto[]> {
    const contractsByHouseId = await this.contractsRepository.find({
      where: { house: { id } },
      relations: { renter: true },
    })

    return plainToInstance(RenterDto, aggregateOccupancyReports(contractsByHouseId), {
      excludeExtraneousValues: true,
    })
  }
}
