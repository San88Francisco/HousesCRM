import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract, ContractStatus } from 'src/contracts/entities/contract.entity'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { Renter } from 'src/renters/entities/renter.entity'
import { Repository } from 'typeorm'
import { aggregateOccupancyReports } from '../helpers/aggregate-occupancy-reports.helper'
import { calculateContractRevenue } from '../helpers/revenue.helpers'
import { AllRenterAnalyticDto } from './dto/all-renter-analytic-response.dto'
import { ContractQueryDto } from './dto/contract-query.dto'
import { ContractWithRevenueResponseDto } from './dto/contract-with-revenue-response.dto'
import { ContractWithRevenueDto } from './dto/contract-with-revenue.dto'
@Injectable()
export class RenterDetailAnalyticsService {
  private readonly validSortableFields: string[] = ['commencement', 'termination', 'monthlyPayment', 'status']

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Renter)
    private readonly renterRepository: Repository<Renter>
  ) {}

  async getAllRenterAnalytic(id: string, dto?: ContractQueryDto): Promise<AllRenterAnalyticDto> {
    const [oneRenterReport, allContractsByRenterId] = await Promise.all([
      this.getOneRenterReport(id),
      this.getAllContractsByRenterId(id, dto),
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

    const reports = aggregateOccupancyReports(contractsByRenterId)
    if (reports.length === 0) {
      const renter = await this.renterRepository.findOne({
        where: { id },
      })

      if (!renter) {
        throw new NotFoundException(`Renter with id ${id} not found`)
      }

      const renterData = {
        ...renter,
        totalIncome: 0,
        status: ContractStatus.INACTIVE,
      }

      return plainToInstance(RenterDto, renterData, { excludeExtraneousValues: true })
    }
    return plainToInstance(RenterDto, reports[0], { excludeExtraneousValues: true })
  }

  async getAllContractsByRenterId(id: string, dto?: ContractQueryDto): Promise<ContractWithRevenueResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = 'commencement',
    } = dto ?? {}

    if (sortBy === 'totalRevenue') {
      return this.getAllContractsSortedByRevenue(id, page, limit, order)
    }

    const orderField = this.validSortableFields.includes(sortBy) ? sortBy : 'commencement'

    const [contracts, total] = await this.contractRepository
      .createQueryBuilder('contract')
      .leftJoin('contract.renter', 'renter')
      .where('renter.id = :id', { id })
      .orderBy(`contract.${orderField}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

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

  private async getAllContractsSortedByRevenue(
    id: string,
    page: number,
    limit: number,
    order: string
  ): Promise<ContractWithRevenueResponseDto> {
    const [contracts, total] = await this.contractRepository
      .createQueryBuilder('contract')
      .leftJoin('contract.renter', 'renter')
      .where('renter.id = :id', { id })
      .getManyAndCount()

    const contractsWithRevenue = contracts.map<ContractWithRevenueDto>((contract) => ({
      ...contract,
      totalRevenue: calculateContractRevenue(contract),
    }))

    contractsWithRevenue.sort((a, b) => {
      const diff = a.totalRevenue - b.totalRevenue
      return order === 'ASC' ? diff : -diff
    })

    const startIndex = (page - 1) * limit
    const paginatedContracts = contractsWithRevenue.slice(startIndex, startIndex + limit)

    const rawData = {
      data: paginatedContracts,
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(ContractWithRevenueResponseDto, rawData, { excludeExtraneousValues: true })
  }
}
