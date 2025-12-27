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
import { UpdateRenterDto } from './dto/update-renter.dto'
import { Renter } from './entities/renter.entity'
import { ExchangeRatesService } from 'src/exchange-rates/exchange-rates.service'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { RenterWithCurrenciesDto } from './dto/renter-with-currencies.dto'

@Injectable()
export class RentersService {
  private readonly validSortableFields: string[] = ['id', 'firstName', 'lastName', 'occupied', 'vacated']

  constructor(
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>,
    private readonly exchangeRatesService: ExchangeRatesService
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

    // Розраховуємо доходи з середнім курсом для кожного орендаря
    const rentersWithCalculatedIncome = await Promise.all(
      rentersWithContracts.map(async (renter) => {
        const contracts = renter.contracts ?? []
        const totalIncome = contracts.reduce((sum, c) => sum + calculateContractRevenue(c), 0)

        if (contracts.length === 0) {
          // Якщо немає контрактів - використовуємо поточні курси
          const rates = await this.exchangeRatesService.getExchangeRatesForDate(new Date())
          const totalIncomeInCurrencies = Object.entries(rates).map(([code, rate]) => ({
            code: code as CurrencyCode,
            amount: Number((totalIncome / rate).toFixed(2)),
            exchangeRate: Number(rate.toFixed(4)),
          }))

          return {
            id: renter.id,
            firstName: renter.firstName,
            lastName: renter.lastName,
            age: renter.age,
            occupied: renter.occupied,
            vacated: renter.vacated,
            totalIncome,
            totalIncomeInCurrencies,
            status: ContractStatus.INACTIVE,
          }
        }

        // Отримуємо курси на початок кожного контракту
        const contractRates = await Promise.all(
          contracts.map((contract) => this.exchangeRatesService.getExchangeRatesForDate(contract.commencement))
        )

        // Рахуємо середній курс для кожної валюти
        const averageRates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>

        // Ініціалізуємо об'єкт для середніх курсів
        Object.values(CurrencyCode).forEach((code) => {
          const rates = contractRates.map((r) => r[code])
          const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length
          averageRates[code] = Number(average.toFixed(4))
        })

        // Конвертуємо totalIncome за середніми курсами
        const totalIncomeInCurrencies = Object.entries(averageRates).map(([code, rate]) => ({
          code: code as CurrencyCode,
          amount: Number((totalIncome / rate).toFixed(2)),
          exchangeRate: Number(rate.toFixed(4)),
        }))

        return {
          id: renter.id,
          firstName: renter.firstName,
          lastName: renter.lastName,
          age: renter.age,
          occupied: renter.occupied,
          vacated: renter.vacated,
          totalIncome,
          totalIncomeInCurrencies,
          status: contracts.some((c) => c.status === ContractStatus.ACTIVE)
            ? ContractStatus.ACTIVE
            : ContractStatus.INACTIVE,
        }
      })
    )

    const rentersDto = plainToInstance(RenterWithCurrenciesDto, rentersWithCalculatedIncome, {
      excludeExtraneousValues: true,
    })

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

    await this.updateRenterDates(savedRenter.id)

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

    await this.updateRenterDates(savedRenter.id)

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
