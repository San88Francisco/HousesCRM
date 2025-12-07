import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Repository } from 'typeorm'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'
import { plainToInstance } from 'class-transformer'
import { QueryDto } from 'src/common/dto/query.dto'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { calculateContractRevenue } from '../helpers/revenue.helpers'
import { ContractWithRevenueDto } from './dto/contract-with-revenue.dto'
import { ContractWithRevenueResponseDto } from './dto/contract-with-revenue-response.dto'
import { AllRenterAnalyticDto } from './dto/all-renter-analytic-response.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'

@Injectable()
export class RenterDetailAnalyticsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
  ) {}

  async getAllRenterAnalytic(id: string): Promise<AllRenterAnalyticDto> {
    const [oneRenterReport, allContractsByRenterId] = await Promise.all([
      this.getOneRenterReport(id),
      this.getAllContractsByRenterId(id),
    ])

    const transformedData = {
      oneRenterReport,
      allContractsByRenterId,
    }

    return plainToInstance(AllRenterAnalyticDto, transformedData, { excludeExtraneousValues: true })
  }

  async getOneRenterReport(id: string): Promise<RenterDto> {
    const contractsByRenterId = await this.contractRepository.find({
      where: { renter: { id } },
      relations: { renter: true },
    })

    return plainToInstance(RenterDto, aggregateOccupancyReports(contractsByRenterId)[0], {
      excludeExtraneousValues: true,
    })
  }

  async getAllContractsByRenterId(id: string, dto?: QueryDto): Promise<ContractWithRevenueResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = QUERY_DEFAULTS.SORT_BY,
    } = dto ?? {}
    const computedSortFields = new Set(['totalRevenue', 'rentersCount', 'currentPayment'])

    const orderField = computedSortFields.has(sortBy as string) ? QUERY_DEFAULTS.SORT_BY : sortBy

    const [contracts, total] = await this.contractRepository.findAndCount({
      where: { renter: { id } },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [orderField]: order,
      },
    })

    const contractsWithRevenue = contracts.map<ContractWithRevenueDto>((contract) => ({
      ...contract,
      totalRevenue: calculateContractRevenue(contract),
    }))

    const rawData = {
      data: contractsWithRevenue,
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(ContractWithRevenueResponseDto, rawData, { excludeExtraneousValues: true })
  }
}
