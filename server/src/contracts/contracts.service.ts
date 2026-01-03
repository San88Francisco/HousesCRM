import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QueryDto } from 'src/common/dto/query.dto'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { ExchangeRatesService } from 'src/exchange-rates/exchange-rates.service'
import { convertAmountToAllCurrencies } from 'src/exchange-rates/helpers/convert-amount.helper'
import { splitContractIntoPeriods } from 'src/exchange-rates/helpers/split-contract-periods.helper'
import { RentersService } from 'src/renters/renters.service'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ContractPdfFileDto } from './dto/contract-pdf-file.dto'
import { ContractResponseDto } from './dto/contract-response.dto'
import { ContractWithCurrenciesDto } from './dto/contract-with-currencies.dto'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract-dto'
import { Contract } from './entities/contract.entity'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private rentersService: RentersService,
    private exchangeRatesService: ExchangeRatesService
  ) {}

  async findAll(dto: QueryDto): Promise<ContractResponseDto> {
    const { page = 1, limit = 10 } = dto

    const [contracts, total] = await this.contractsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    const allPeriodDates = new Set<string>()
    const contractPeriods = new Map<string, Array<{ from: Date; to: Date }>>()

    contracts.forEach((contract) => {
      const periods = splitContractIntoPeriods(contract.commencement, contract.termination)
      contractPeriods.set(contract.id, periods)

      periods.forEach((period) => {
        allPeriodDates.add(period.from.toISOString().split('T')[0])
      })
    })

    const ratesByDate = new Map<string, Record<CurrencyCode, number>>()
    await Promise.all(
      Array.from(allPeriodDates).map(async (dateStr) => {
        const rates = await this.exchangeRatesService.getExchangeRatesForDate(new Date(dateStr))
        ratesByDate.set(dateStr, rates)
      })
    )

    const contractsDto = contracts.map((contract) => {
      const periods = contractPeriods.get(contract.id) || []

      const monthlyPaymentInCurrencies = periods.map((period) => {
        const dateKey = period.from.toISOString().split('T')[0]
        const rates = ratesByDate.get(dateKey)
        if (!rates) {
          throw new Error(`Exchange rates not found for date: ${dateKey}`)
        }

        return {
          period: {
            from: period.from,
            to: period.to,
          },
          currencies: convertAmountToAllCurrencies(contract.monthlyPayment, rates),
        }
      })

      return {
        ...contract,
        monthlyPaymentInCurrencies,
      }
    })

    const rawData = {
      data: plainToInstance(ContractWithCurrenciesDto, contractsDto, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(ContractResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  async findById(id: string): Promise<ContractWithRelationsDto> {
    const contract = await this.contractsRepository.findOneOrFail({
      where: { id },
      relations: { renter: true, house: true },
    })

    return plainToInstance(ContractWithRelationsDto, contract, {
      excludeExtraneousValues: true,
    })
  }

  async getPdfFileData(id: string): Promise<ContractPdfFileDto> {
    const contract = await this.contractsRepository.findOneOrFail({
      where: { id },
      relations: { renter: true, house: true },
    })

    return plainToInstance(
      ContractPdfFileDto,
      {
        renterFirstName: contract.renter?.firstName ?? '',
        renterLastName: contract.renter?.lastName ?? '',
        roomsCount: contract.house?.roomsCount ?? 0,
        street: contract.house?.street ?? '',
        commencement: contract.commencement,
        monthlyPayment: contract.monthlyPayment,
      },
      {
        excludeExtraneousValues: true,
      }
    )
  }

  async create(dto: CreateContractDto): Promise<ContractWithRelationsDto> {
    const contractToSave = this.contractsRepository.create({
      ...dto,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
    })

    const savedContract = await this.contractsRepository.save(contractToSave)

    if (dto.renterId) {
      await this.rentersService.updateRenterDates(dto.renterId)
    }

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateContractDto, id: string): Promise<ContractWithRelationsDto> {
    const oldContract = await this.contractsRepository.findOne({ where: { id } })

    const contractToUpdate = await this.contractsRepository.preload({
      id,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
      ...dto,
    })

    if (!contractToUpdate) {
      throw new NotFoundException('Contract not found')
    }

    const savedContract = await this.contractsRepository.save(contractToUpdate)

    const newRenterId = dto.renterId || savedContract.renterId
    if (newRenterId) {
      await this.rentersService.updateRenterDates(newRenterId)
    }

    if (oldContract && oldContract.renterId && dto.renterId && oldContract.renterId !== dto.renterId) {
      await this.rentersService.updateRenterDates(oldContract.renterId)
    }

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string): Promise<void> {
    const contract = await this.contractsRepository.findOne({ where: { id } })

    const res = await this.contractsRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Contract, id)
    }

    if (contract?.renterId) {
      await this.rentersService.updateRenterDates(contract.renterId)
    }
  }
}
