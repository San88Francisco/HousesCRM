import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Cache } from 'cache-manager'
import { plainToInstance } from 'class-transformer'
import { calculateContractRevenue } from 'src/analytics/helpers/revenue.helpers'
import { ContractDto } from 'src/contracts/dto/contract.dto'
import { Contract, ContractStatus } from 'src/contracts/entities/contract.entity'
import { HouseDto } from 'src/houses/dto/house.dto'
import { House } from 'src/houses/entities/house.entity'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { Renter } from 'src/renters/entities/renter.entity'
import { Repository } from 'typeorm'
import { SearchQueryDto } from './dto/search-query.dto'
import { SearchResponseDto } from './dto/search-response.dto'

const SEARCH_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 1 month

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(House)
    private readonly housesRepository: Repository<House>,
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async search({ term }: SearchQueryDto, userId: string): Promise<SearchResponseDto> {
    const normalized = term?.trim()

    if (!normalized) {
      return plainToInstance(
        SearchResponseDto,
        { houses: [], renters: [], contracts: [] },
        { excludeExtraneousValues: true }
      )
    }

    const cacheKey = `search:${userId}:${normalized.toLowerCase()}`
    const cached = await this.cacheManager.get<SearchResponseDto>(cacheKey)
    if (cached) {
      return cached
    }

    const likeTerm = this.toLikeParam(normalized)
    const lowerTerm = normalized.toLowerCase()

    const [houses, contracts, renters] = await Promise.all([
      this.searchHouses(likeTerm, userId),
      this.searchContracts(likeTerm, userId),
      this.searchRenters(lowerTerm, userId),
    ])

    const result = plainToInstance(SearchResponseDto, { houses, contracts, renters }, { excludeExtraneousValues: true })

    await this.cacheManager.set(cacheKey, result, SEARCH_CACHE_TTL_MS)

    return result
  }

  private async searchHouses(term: string, userId: string): Promise<HouseDto[]> {
    const qb = this.housesRepository.createQueryBuilder('house')

    qb.where('house.userId = :userId', { userId }).andWhere(
      '(LOWER(house.apartmentName) LIKE :term OR LOWER(house.street) LIKE :term OR LOWER(CAST(house.apartmentType AS TEXT)) LIKE :term OR LOWER(CAST(house.totalArea AS TEXT)) LIKE :term OR LOWER(CAST(house.roomsCount AS TEXT)) LIKE :term OR LOWER(CAST(house.purchaseDate AS TEXT)) LIKE :term)',
      { term }
    )

    const houses = await qb.getMany()

    return plainToInstance(HouseDto, houses, {
      excludeExtraneousValues: true,
    })
  }

  private async searchContracts(term: string, userId: string): Promise<ContractDto[]> {
    const qb = this.contractsRepository.createQueryBuilder('contract')

    qb.innerJoin('contract.house', 'house')
      .where('house.userId = :userId', { userId })
      .andWhere(
        '(LOWER(CAST(contract.commencement AS TEXT)) LIKE :term OR LOWER(CAST(contract.termination AS TEXT)) LIKE :term OR LOWER(CAST(contract.monthlyPayment AS TEXT)) LIKE :term OR LOWER(CAST(contract.status AS TEXT)) LIKE :term)',
        { term }
      )

    const contracts = await qb.getMany()

    return plainToInstance(ContractDto, contracts, {
      excludeExtraneousValues: true,
    })
  }

  private async searchRenters(term: string, userId: string): Promise<RenterDto[]> {
    const renters = await this.rentersRepository
      .createQueryBuilder('renter')
      .innerJoinAndSelect('renter.contracts', 'contract')
      .innerJoin('contract.house', 'house')
      .where('house.userId = :userId', { userId })
      .getMany()

    const rentersWithStats = renters.map((renter) => {
      const contracts = renter.contracts ?? []
      const totalIncome = contracts.reduce((sum, contract) => sum + calculateContractRevenue(contract), 0)
      const hasActiveContract = contracts.some((contract) => contract.status === ContractStatus.ACTIVE)
      const status = hasActiveContract ? ContractStatus.ACTIVE : ContractStatus.INACTIVE

      return {
        ...renter,
        totalIncome,
        status,
      }
    })

    const filtered = rentersWithStats.filter((renter) =>
      this.matchesTerm(
        [renter.firstName, renter.lastName, renter.occupied, renter.vacated, renter.totalIncome, renter.status],
        term
      )
    )

    return plainToInstance(RenterDto, filtered, {
      excludeExtraneousValues: true,
    })
  }

  private matchesTerm(values: (string | number | boolean | bigint | Date | null | undefined)[], term: string): boolean {
    return values.some((value) => this.valueContainsTerm(value, term))
  }

  private valueContainsTerm(
    value: string | number | boolean | bigint | Date | null | undefined,
    term: string
  ): boolean {
    if (value === null || value === undefined) {
      return false
    }

    if (value instanceof Date) {
      return value.toISOString().toLowerCase().includes(term)
    }

    return String(value).toLowerCase().includes(term)
  }

  private toLikeParam(term: string): string {
    return `%${term.toLowerCase()}%`
  }
}
