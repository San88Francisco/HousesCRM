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
      .select('COUNT(DISTINCT r.id)', 'cnt')
      .innerJoin('r.contracts', 'c')
      .innerJoin('c.house', 'h')
      .where('h.userId = :userId', { userId })
      .getRawOne<{ cnt: string }>()

    const total = Number(countRow?.cnt ?? 0)

    if (total === 0) {
      return plainToInstance(
        RenterResponseDto,
        { data: [], meta: { total: 0, page, limit } },
        { excludeExtraneousValues: true }
      )
    }

    const idRows = await this.rentersRepository
      .createQueryBuilder('r')
      .select('r.id', 'id')
      .innerJoin('r.contracts', 'c')
      .innerJoin('c.house', 'h')
      .where('h.userId = :userId', { userId })
      .groupBy('r.id')
      .orderBy(`r.${orderField}`, order)
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany()

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
      .innerJoinAndSelect('renter.contracts', 'contracts')
      .innerJoin('contracts.house', 'house')
      .where('renter.id IN (:...ids)', { ids })
      .andWhere('house.userId = :userId', { userId })
      .getMany()

    const orderIndex = new Map(ids.map((rid, i) => [rid, i]))
    rentersWithContracts.sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0))

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

  async findById(id: string, userId: string): Promise<RenterWithContractDto> {
    const hasAccess = await this.contractsRepository.exists({
      where: { renter: { id }, house: { userId } },
    })
    if (!hasAccess) {
      throw new NotFoundException('Renter not found')
    }

    const renter = await this.rentersRepository.findOneOrFail({
      where: { id },
      relations: { contracts: { house: true } },
    })

    renter.contracts = (renter.contracts ?? []).filter((c) => c.house?.userId === userId)

    return plainToInstance(RenterWithContractDto, renter, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateRenterDto, userId: string): Promise<RenterWithContractDto> {
    if (dto.contractIds?.length) {
      await this.assertContractIdsOwnedByUser(dto.contractIds, userId)
    }

    const renterToSave = this.rentersRepository.create({
      ...dto,
      contracts: dto.contractIds?.map((cid) => ({ id: cid })),
    })

    const savedRenter = await this.rentersRepository.save(renterToSave)

    await this.updateRenterDates(savedRenter.id)

    const renterWithContracts = await this.findById(savedRenter.id, userId)

    return plainToInstance(RenterWithContractDto, renterWithContracts, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateRenterDto, id: string, userId: string): Promise<RenterWithContractDto> {
    await this.findById(id, userId)

    if (dto.contractIds?.length) {
      await this.assertContractIdsOwnedByUser(dto.contractIds, userId)
    }

    const renterToUpdate = await this.rentersRepository.preload({
      id,
      ...dto,
      contracts: dto.contractIds?.map((cid) => ({ id: cid })),
    })

    if (!renterToUpdate) {
      throw new NotFoundException('Renter not found')
    }

    const savedRenter = await this.rentersRepository.save(renterToUpdate)

    await this.updateRenterDates(savedRenter.id)

    const renterWithContracts = await this.findById(savedRenter.id, userId)

    return plainToInstance(RenterWithContractDto, renterWithContracts, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    const contracts = await this.contractsRepository.find({
      where: { renter: { id } },
      relations: { house: true },
    })

    if (contracts.some((c) => c.house.userId !== userId)) {
      throw new ForbiddenException('Cannot delete renter that is linked to another account')
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
