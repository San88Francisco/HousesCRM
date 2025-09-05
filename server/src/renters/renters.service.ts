import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Renter } from './entities/renter.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { RenterDto } from './dto/renter.dto'
import { RenterWithContractDto } from './dto/renter-with-contracts.dto'
import { CreateRenterDto } from './dto/create-renter.dto'
import { UpdateRenterDto } from './dto/update-renter.dto'
import { QueryDto } from 'src/common/dto/query.dto'
import { RenterResponseDto } from './dto/renter-response.dto'

@Injectable()
export class RentersService {
  constructor(
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>
  ) {}

  public async findAll(dto: QueryDto): Promise<RenterResponseDto> {
    const { page = 1, limit = 10 } = dto

    const [renters, total] = await this.rentersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    const rentersDto = plainToInstance(RenterDto, renters, {
      excludeExtraneousValues: true,
    })

    const rawData = {
      data: rentersDto,
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(RenterResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  public async findById(id: string): Promise<RenterWithContractDto> {
    const renter = await this.rentersRepository.findOneOrFail({
      where: { id },
      relations: { contracts: { house: true } },
    })

    return plainToInstance(RenterWithContractDto, renter, {
      excludeExtraneousValues: true,
    })
  }

  public async create(dto: CreateRenterDto): Promise<RenterWithContractDto> {
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

  public async update(dto: UpdateRenterDto, id: string): Promise<RenterWithContractDto> {
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

  public async remove(id: string): Promise<void> {
    const res = await this.rentersRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(Renter, id)
    }
  }
}
