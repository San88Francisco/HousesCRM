import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'
import { HouseDetailAnalyticDto } from './dto/house-detail-analytic.dto'

@Injectable()
export class HouseDetailAnalyticsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>
  ) {}

  public async getHouseOccupancyReport(id: string): Promise<HouseDetailAnalyticDto[]> {
    const contractsByHouseId = await this.contractsRepository.find({
      where: { house: { id } },
      relations: { renter: true },
    })

    return plainToInstance(HouseDetailAnalyticDto, aggregateOccupancyReports(contractsByHouseId), {
      excludeExtraneousValues: true,
    })
  }
}
