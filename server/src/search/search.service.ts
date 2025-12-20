import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { House } from 'src/houses/entities/house.entity'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Renter } from 'src/renters/entities/renter.entity'
import { SearchQueryDto } from './dto/search-query.dto'
import { SearchResponseDto } from './dto/search-response.dto'
import { plainToInstance } from 'class-transformer'
import { HouseDto } from 'src/houses/dto/house.dto'
import { ContractDto } from 'src/contracts/dto/contract.dto'
import { RenterDto } from 'src/renters/dto/renter.dto'
import { calculateContractRevenue } from 'src/analytics/helpers/revenue.helpers'
import { ContractStatus } from 'src/contracts/entities/contract.entity'

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(House)
    private readonly housesRepository: Repository<House>,
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>,
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>
  ) {}

  async search({ term }: SearchQueryDto): Promise<SearchResponseDto> {
    const normalized = term?.trim()

    if (!normalized) {
      return plainToInstance(
        SearchResponseDto,
        { houses: [], renters: [], contracts: [] },
        { excludeExtraneousValues: true }
      )
    }

    const likeTerm = this.toLikeParam(normalized)
    const lowerTerm = normalized.toLowerCase()

    const [houses, contracts, renters] = await Promise.all([
      this.searchHouses(likeTerm),
      this.searchContracts(likeTerm),
      this.searchRenters(lowerTerm),
    ])

    return plainToInstance(
      SearchResponseDto,
      {
        houses,
        contracts,
        renters,
      },
      { excludeExtraneousValues: true }
    )
  }

  private async searchHouses(term: string): Promise<HouseDto[]> {
    const qb = this.housesRepository.createQueryBuilder('house')

    qb.where('LOWER(house.apartmentName) LIKE :term', { term })
      .orWhere('LOWER(house.street) LIKE :term', { term })
      .orWhere('LOWER(CAST(house.apartmentType AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(house.totalArea AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(house.roomsCount AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(house.purchaseDate AS TEXT)) LIKE :term', { term })

    const houses = await qb.getMany()

    return plainToInstance(HouseDto, houses, {
      excludeExtraneousValues: true,
    })
  }

  private async searchContracts(term: string): Promise<ContractDto[]> {
    const qb = this.contractsRepository.createQueryBuilder('contract')

    qb.where('LOWER(CAST(contract.commencement AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(contract.termination AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(contract.monthlyPayment AS TEXT)) LIKE :term', { term })
      .orWhere('LOWER(CAST(contract.status AS TEXT)) LIKE :term', { term })

    const contracts = await qb.getMany()

    return plainToInstance(ContractDto, contracts, {
      excludeExtraneousValues: true,
    })
  }

  private async searchRenters(term: string): Promise<RenterDto[]> {
    const renters = await this.rentersRepository.find({
      relations: { contracts: true },
    })

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
