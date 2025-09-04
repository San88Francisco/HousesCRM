import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ContractDto } from './dto/contract.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { plainToInstance } from 'class-transformer'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { UpdateContractDto } from './dto/update-contract-dto'
import { PaginatedContractResponseDto } from './dto/paginated-contract-response.dto'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>
  ) {}

  public async findAll(dto: PaginationQueryDto): Promise<PaginatedContractResponseDto> {
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

    return plainToInstance(PaginatedContractResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  public async findById(id: string): Promise<ContractWithRelationsDto> {
    const contract = await this.contractsRepository.findOneOrFail({
      where: { id },
      relations: { renter: true, house: true },
    })

    return plainToInstance(ContractWithRelationsDto, contract, {
      excludeExtraneousValues: true,
    })
  }

  public async create(dto: CreateContractDto): Promise<ContractWithRelationsDto> {
    const contractToSave = this.contractsRepository.create({
      ...dto,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
    })

    const savedContract = await this.contractsRepository.save(contractToSave)

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  public async update(dto: UpdateContractDto, id: string): Promise<ContractWithRelationsDto> {
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

    const contractWithRelations = await this.findById(savedContract.id)

    return plainToInstance(ContractWithRelationsDto, contractWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  public async remove(id: string): Promise<void> {
    const res = await this.contractsRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Contract, id)
    }
  }
}
