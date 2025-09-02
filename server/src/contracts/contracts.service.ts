import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { ContractDto } from './dto/contract.dto'
import { CreateContractDto } from './dto/create-contract.dto'
import { plainToInstance } from 'class-transformer'
import { ContractWithRelationsDto } from './dto/contract-with-relations.dto'
import { UpdateContractDto } from './dto/update-contract-dto'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>
  ) {}

  public async findAll(): Promise<ContractDto[]> {
    const contracts = await this.contractsRepository.find()

    return plainToInstance(ContractDto, contracts, {
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
    const entity = this.contractsRepository.create({
      ...dto,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
    })

    const newContract = await this.contractsRepository.save(entity)

    return plainToInstance(ContractWithRelationsDto, newContract, {
      excludeExtraneousValues: true,
    })
  }

  public async update(dto: UpdateContractDto, id: string): Promise<ContractWithRelationsDto> {
    const contract = await this.contractsRepository.preload({
      id,
      house: { id: dto.houseId },
      renter: { id: dto.renterId },
      ...dto,
    })

    if (!contract) {
      throw new NotFoundException('Contract not found')
    }

    const entity = await this.contractsRepository.save(contract)

    return plainToInstance(ContractWithRelationsDto, entity, {
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
