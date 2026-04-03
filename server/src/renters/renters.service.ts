import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { calculateContractRevenue } from 'src/analytics/helpers/revenue.helpers'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract, ContractStatus } from 'src/contracts/entities/contract.entity'
import { EntityNotFoundError, In, Repository } from 'typeorm'
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

  private readonly renterVisibilityWhere =
    '(r.created_by_user_id = :userId OR EXISTS (SELECT 1 FROM contract c INNER JOIN house h ON h.id = c."houseId" WHERE c."renterId" = r.id AND h."userId" = :userId))'

  constructor(
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>,
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>
  ) {}

  private async assertContractIdsOwnedByUser(contractIds: string[], userId: string): Promise<void> {
    const count = await this.contractsRepository.count({
      where: { id: In(contractIds), house: { userId } },
    })
    if (count !== contractIds.length) {
      throw new NotFoundException('One or more contracts not found')
    }
  }

  /** Load renter for API response; contracts limited to the given user's houses (may be empty right after create). */
  private async mapRenterToDtoWithUserContracts(renterId: string, userId: string): Promise<RenterWithContractDto> {
    const renter = await this.rentersRepository.findOne({
      where: { id: renterId },
      relations: { contracts: { house: true } },
    })
    if (!renter) {
      throw new NotFoundException('Renter not found')
    }
    renter.contracts = (renter.contracts ?? []).filter((c) => c.house?.userId === userId)
    return plainToInstance(RenterWithContractDto, renter, {
      excludeExtraneousValues: true,
    })
  }

  async findAll(dto: RenterQueryDto, userId: string): Promise<RenterResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = 'occupied',
    } = dto

    const orderField = this.validSortableFields.includes(sortBy) ? sortBy : 'occupied'

    const countRow = await this.rentersRepository
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'cnt')
      .where(this.renterVisibilityWhere, { userId })
      .getRawOne<{ cnt: string }>()

    const total = Number(countRow?.cnt ?? 0)

    if (total === 0) {
      return plainToInstance(
        RenterResponseDto,
        { data: [], meta: { total: 0, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const idQb = this.rentersRepository
      .createQueryBuilder('r')
      .select('r.id', 'id')
      .where(this.renterVisibilityWhere, { userId })
      .orderBy(`r.${orderField}`, order, 'NULLS LAST')
      .addOrderBy('r.id', 'ASC')
      .offset((page - 1) * limit)
      .limit(limit)

    const idRows = await idQb.getRawMany()

    const ids = idRows.map((row: { id: string }) => row.id)
    if (ids.length === 0) {
      return plainToInstance(
        RenterResponseDto,
        { data: [], meta: { total, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const rentersWithContracts = await this.rentersRepository
      .createQueryBuilder('renter')
      .leftJoinAndSelect('renter.contracts', 'contracts')
      .leftJoinAndSelect('contracts.house', 'house')
      .where('renter.id IN (:...ids)', { ids })
      .getMany()

    const orderIndex = new Map(ids.map((rid, i) => [rid, i]))
    rentersWithContracts.sort((a, b) => {
      const posA = typeof a.id === 'string' ? (orderIndex.get(a.id) ?? 0) : 0
      const posB = typeof b.id === 'string' ? (orderIndex.get(b.id) ?? 0) : 0
      return posA - posB
    })

    const rentersDto = plainToInstance(
      RenterDto,
      rentersWithContracts.map((renter) => {
        const contracts = (renter.contracts ?? []).filter((c) => c.house?.userId === userId)
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

  async findById(id: string, userId: string): Promise<RenterWithContractDto> {
    const renter = await this.rentersRepository.findOne({
      where: { id },
      relations: { contracts: { house: true } },
    })
    if (!renter) {
      throw new NotFoundException('Renter not found')
    }

    const ownsViaContract = (renter.contracts ?? []).some((c) => c.house?.userId === userId)
    const isCreator = renter.createdByUserId === userId
    if (!ownsViaContract && !isCreator) {
      throw new NotFoundException('Renter not found')
    }

    renter.contracts = (renter.contracts ?? []).filter((c) => c.house?.userId === userId)

    return plainToInstance(RenterWithContractDto, renter, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateRenterDto, userId: string): Promise<RenterWithContractDto> {
    if (dto.contractIds?.length) {
      await this.assertContractIdsOwnedByUser(dto.contractIds, userId)
    }

    const { contractIds, ...fields } = dto
    const renterToSave = this.rentersRepository.create({
      ...fields,
      createdByUserId: userId,
      contracts: contractIds?.map((cid) => ({ id: cid })),
    })

    const savedRenter = await this.rentersRepository.save(renterToSave)
    const persistedId = savedRenter.id
    if (!persistedId) {
      throw new Error('Renter id missing after save')
    }

    await this.updateRenterDates(persistedId)

    return this.mapRenterToDtoWithUserContracts(persistedId, userId)
  }

  async update(dto: UpdateRenterDto, id: string, userId: string): Promise<RenterWithContractDto> {
    await this.findById(id, userId)

    if (dto.contractIds?.length) {
      await this.assertContractIdsOwnedByUser(dto.contractIds, userId)
    }

    const { contractIds, ...renterFields } = dto
    const renterToUpdate = await this.rentersRepository.preload({
      id,
      ...renterFields,
      contracts: contractIds?.map((cid) => ({ id: cid })),
    })

    if (!renterToUpdate) {
      throw new NotFoundException('Renter not found')
    }

    const savedRenter = await this.rentersRepository.save(renterToUpdate)
    const persistedId = savedRenter.id
    if (!persistedId) {
      throw new Error('Renter id missing after save')
    }

    await this.updateRenterDates(persistedId)

    return this.mapRenterToDtoWithUserContracts(persistedId, userId)
  }

  async remove(id: string, userId: string): Promise<void> {
    const renter = await this.rentersRepository.findOne({ where: { id } })
    if (!renter) {
      throw new EntityNotFoundError(Renter, id)
    }

    const contracts = await this.contractsRepository.find({
      where: { renter: { id } },
      relations: { house: true },
    })

    if (contracts.some((c) => c.house.userId !== userId)) {
      throw new ForbiddenException('Cannot delete renter that is linked to another account')
    }

    const hasOwnContract = contracts.some((c) => c.house.userId === userId)
    const isCreator = renter.createdByUserId === userId
    if (!hasOwnContract && !isCreator) {
      throw new NotFoundException('Renter not found')
    }

    const res = await this.rentersRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Renter, id)
    }
  }

  /**
   * Оновлює дати occupied і vacated для рентаря на основі його контрактів
   * occupied = найменша дата commencement
   * vacated = найбільша дата termination (може бути null)
   */
  async updateRenterDates(renterId: string): Promise<void> {
    const renter = await this.rentersRepository.findOne({
      where: { id: renterId },
      relations: { contracts: true },
    })

    if (!renter || !renter.contracts || renter.contracts.length === 0) {
      await this.rentersRepository.update(renterId, {
        occupied: null,
        vacated: null,
      })
      return
    }

    const occupied = renter.contracts.reduce(
      (minDate, contract) => {
        if (!contract.commencement) {
          return minDate
        }
        if (!minDate) {
          return contract.commencement
        }
        return contract.commencement < minDate ? contract.commencement : minDate
      },
      null as Date | null
    )

    const vacated = renter.contracts.reduce(
      (maxDate, contract) => {
        if (!contract.termination) {
          return maxDate
        }
        if (!maxDate) {
          return contract.termination
        }
        return contract.termination > maxDate ? contract.termination : maxDate
      },
      null as Date | null
    )

    await this.rentersRepository.update(renterId, {
      occupied,
      vacated,
    })
  }
}
