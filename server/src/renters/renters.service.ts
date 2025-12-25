import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { calculateContractRevenue } from 'src/analytics/helpers/revenue.helpers'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { ContractStatus } from 'src/contracts/entities/contract.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateRenterDto } from './dto/create-renter.dto'
import { RenterQueryDto } from './dto/renter-query.dto'
import { RenterResponseDto } from './dto/renter-response.dto'
import { RenterWithContractDto } from './dto/renter-with-contracts.dto'
import { RenterDto } from './dto/renter.dto'
import { UpdateRenterDto } from './dto/update-renter.dto'
import { Renter } from './entities/renter.entity'

@Injectable()
export class RentersService {
  private readonly validSortableFields: string[] = ['id', 'firstName', 'lastName', 'occupied', 'vacated']

  constructor(
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>
  ) {}

  async findAll(dto: RenterQueryDto): Promise<RenterResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = 'occupied',
    } = dto

    const orderField = this.validSortableFields.includes(sortBy) ? sortBy : 'occupied'

    const total = await this.rentersRepository.count()

    if (total === 0) {
      return plainToInstance(
        RenterResponseDto,
        { data: [], meta: { total: 0, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const subQuery = this.rentersRepository
      .createQueryBuilder('sub')
      .select('sub.id')
      .orderBy(`sub.${orderField}`, order)
      .limit(limit)
      .offset((page - 1) * limit)

    const rentersWithContracts = await this.rentersRepository
      .createQueryBuilder('renter')
      .leftJoinAndSelect('renter.contracts', 'contracts')
      .where(`renter.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .orderBy(`renter.${orderField}`, order)
      .getMany()

    const rentersDto = plainToInstance(
      RenterDto,
      rentersWithContracts.map((renter) => {
        const contracts = renter.contracts ?? []
        const totalIncome = contracts.reduce((sum, c) => sum + calculateContractRevenue(c), 0)

        return {
          id: renter.id,
          firstName: renter.firstName,
          lastName: renter.lastName,
          occupied: renter.occupied,
          vacated: renter.vacated,
          totalIncome,
          status: contracts.some((c) => c.status === ContractStatus.ACTIVE)
            ? ContractStatus.ACTIVE
            : ContractStatus.INACTIVE,
        }
      }),
      { excludeExtraneousValues: true }
    )

    return plainToInstance(
      RenterResponseDto,
      {
        data: rentersDto,
        meta: {
          total,
          page,
          limit,
        },
      },
      { excludeExtraneousValues: true }
    )
  }

  async findById(id: string): Promise<RenterWithContractDto> {
    const renter = await this.rentersRepository.findOneOrFail({
      where: { id },
      relations: { contracts: { house: true } },
    })

    return plainToInstance(RenterWithContractDto, renter, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateRenterDto): Promise<RenterWithContractDto> {
    const renterToSave = this.rentersRepository.create({
      ...dto,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    const savedRenter = await this.rentersRepository.save(renterToSave)

    const renterWithContracts = await this.findById(savedRenter.id)

    return plainToInstance(RenterWithContractDto, renterWithContracts, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateRenterDto, id: string): Promise<RenterWithContractDto> {
    const renterToUpdate = await this.rentersRepository.preload({
      id,
      ...dto,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    if (!renterToUpdate) {
      throw new NotFoundException('Renter not found')
    }

    const savedRenter = await this.rentersRepository.save(renterToUpdate)

    const renterWithContracts = await this.findById(savedRenter.id)

    return plainToInstance(RenterWithContractDto, renterWithContracts, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string): Promise<void> {
    const res = await this.rentersRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Renter, id)
    }
  }
}
