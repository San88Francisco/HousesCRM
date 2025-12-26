import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ContractDto } from './dto/contract.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { plainToInstance } from 'class-transformer'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { UpdateContractDto } from './dto/update-contract-dto'
import { ContractResponseDto } from './dto/contract-response.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { ContractPdfFileDto } from './dto/contract-pdf-file.dto'
import { RentersService } from 'src/renters/renters.service'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    private rentersService: RentersService
  ) {}

  async findAll(dto: QueryDto): Promise<ContractResponseDto> {
    const { page = 1, limit = 10 } = dto

    const [contracts, total] = await this.contractsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    const contractsDto = plainToInstance(ContractDto, contracts, {
      excludeExtraneousValues: true,
    })

    const rawData = {
      data: contractsDto,
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

    // Оновлюємо дати рентаря після створення контракту
    if (dto.renterId) {
      await this.rentersService.updateRenterDates(dto.renterId)
    }

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateContractDto, id: string): Promise<ContractWithRelationsDto> {
    // Отримуємо старий контракт для збереження старого renterId
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

    // Оновлюємо дати для нового рентаря (якщо він вказаний)
    const newRenterId = dto.renterId || savedContract.renterId
    if (newRenterId) {
      await this.rentersService.updateRenterDates(newRenterId)
    }

    // Якщо рентар змінився, оновлюємо дати і для старого рентаря
    if (oldContract && oldContract.renterId && dto.renterId && oldContract.renterId !== dto.renterId) {
      await this.rentersService.updateRenterDates(oldContract.renterId)
    }

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string): Promise<void> {
    // Отримуємо контракт перед видаленням для збереження renterId
    const contract = await this.contractsRepository.findOne({ where: { id } })

    const res = await this.contractsRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Contract, id)
    }

    // Оновлюємо дати рентаря після видалення контракту
    if (contract?.renterId) {
      await this.rentersService.updateRenterDates(contract.renterId)
    }
  }
}
