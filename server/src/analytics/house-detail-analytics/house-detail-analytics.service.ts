import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'
import { QueryDto } from 'src/common/dto/query.dto'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { HouseDetailAnalyticResponseDto } from './dto/house-detail-analytic-response.dto'

@Injectable()
export class HouseDetailAnalyticsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>
  ) {}

  public async getHouseOccupancyReport(id: string, dto?: QueryDto): Promise<HouseDetailAnalyticResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = QUERY_DEFAULTS.SORT_BY,
    } = dto ?? {}

    const [contractsByHouseId, total] = await this.contractsRepository.findAndCount({
      where: { house: { id } },
      relations: { renter: true },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: order,
      },
    })

    const rawData = {
      data: aggregateOccupancyReports(contractsByHouseId),
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(HouseDetailAnalyticResponseDto, rawData, { excludeExtraneousValues: true })
  }
}
