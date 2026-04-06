import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QueryDto } from 'src/common/dto/query.dto'
import { House } from 'src/houses/entities/house.entity'
import { RentersService } from 'src/renters/renters.service'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ContractPdfFileDto } from './dto/contract-pdf-file.dto'
import { ContractResponseDto } from './dto/contract-response.dto'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract-dto'
import { Contract } from './entities/contract.entity'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    private rentersService: RentersService
  ) {}

  private async assertHouseOwnedByUser(houseId: string, userId: string): Promise<void> {
    const owned = await this.houseRepository.exist({ where: { id: houseId, userId } })
    if (!owned) {
      throw new NotFoundException('House not found')
    }
  }

  async findAll(dto: QueryDto, userId: string): Promise<ContractResponseDto> {
    const { page = 1, limit = 10 } = dto

    const qb = this.contractsRepository
      .createQueryBuilder('contract')
      .innerJoinAndSelect('contract.house', 'house')
      .leftJoinAndSelect('contract.renter', 'renter')
      .where('house.userId = :userId', { userId })
      .orderBy('contract.commencement', 'DESC')

    const total = await qb.getCount()
    const contracts = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    const contractsDto = plainToInstance(ContractWithRelationsDto, contracts, {
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

  async findById(id: string, userId: string): Promise<ContractWithRelationsDto> {
    const contract = await this.contractsRepository.findOne({
      where: { id, house: { userId } },
      relations: { renter: true, house: true },
    })

    if (!contract) {
      throw new NotFoundException('Contract not found')
    }

    return plainToInstance(ContractWithRelationsDto, contract, {
      excludeExtraneousValues: true,
    })
  }

  async getPdfFileData(id: string, userId: string): Promise<ContractPdfFileDto> {
    const contract = await this.contractsRepository.findOne({
      where: { id, house: { userId } },
      relations: { renter: true, house: true },
    })

    if (!contract) {
      throw new NotFoundException('Contract not found')
    }

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

  async create(dto: CreateContractDto, userId: string): Promise<ContractWithRelationsDto> {
    if (!dto.houseId) {
      throw new BadRequestException('houseId is required')
    }
    if (!dto.renterId) {
      throw new BadRequestException('renterId is required')
    }

    await this.assertHouseOwnedByUser(dto.houseId, userId)

    const contractToSave = this.contractsRepository.create({
      ...dto,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
    })

    const savedContract = await this.contractsRepository.save(contractToSave)

    if (dto.renterId) {
      await this.rentersService.updateRenterDates(dto.renterId)
    }

    const contractWithRelations = await this.findById(savedContract.id, userId)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateContractDto, id: string, userId: string): Promise<ContractWithRelationsDto> {
    const oldContract = await this.contractsRepository.findOne({
      where: { id },
      relations: { house: true },
    })

    if (!oldContract || oldContract.house.userId !== userId) {
      throw new NotFoundException('Contract not found')
    }

    const houseId = dto.houseId ?? oldContract.houseId
    if (houseId !== oldContract.houseId) {
      await this.assertHouseOwnedByUser(houseId, userId)
    }

    const contractToUpdate = await this.contractsRepository.preload({
      id,
      house: { id: houseId },
      renter: { id: dto.renterId ?? oldContract.renterId },
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

    const contractWithRelations = await this.findById(savedContract.id, userId)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: { house: true },
    })

    if (!contract || contract.house.userId !== userId) {
      throw new NotFoundException('Contract not found')
    }

    const res = await this.contractsRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Contract, id)
    }

    if (contract?.renterId) {
      await this.rentersService.updateRenterDates(contract.renterId)
    }
  }
}
