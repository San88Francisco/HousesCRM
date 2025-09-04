import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { House } from './entities/house.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateHouseDto } from './dto/create-house.dto'
import { HouseDto } from './dto/house.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateHouseDto } from './dto/update-house.dto'
import { HousePriceService } from 'src/house-prices/house-price.service'
import { HouseWithRelationsDto } from './dto/house-with-relations.dto'
import { HousePricesConverterService } from 'src/house-prices/house-prices.converter.service'
import { Contract } from 'src/contracts/entities/contract.entity'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { PaginatedHouseResponseDto } from './dto/paginated-houses-response.dto'

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    private housePriceService: HousePriceService,
    private housePricesConverterService: HousePricesConverterService
  ) {}

  public async findAll(dto: PaginationQueryDto): Promise<PaginatedHouseResponseDto> {
    const { page = 1, limit = 10 } = dto

    const [houses, total] = await this.houseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })

    const housesDto = plainToInstance(HouseDto, houses, {
      excludeExtraneousValues: true,
    })

    const rawData = {
      data: housesDto,
      meta: {
        total,
        page,
        limit,
      },
    }

    return plainToInstance(PaginatedHouseResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  public async findById(id: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: {
        prices: true,
        contracts: { renter: true },
      },
    })

    return plainToInstance(HouseWithRelationsDto, house, {
      excludeExtraneousValues: true,
    })
  }

  public async create(dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    const houseToSave = this.houseRepository.create({
      ...dto,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    houseToSave.prices = this.housePricesConverterService.convert(dto.price, houseToSave)

    const savedHouse = await this.houseRepository.save(houseToSave)

    const houseWithRelations = await this.findById(savedHouse.id)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  public async update(dto: UpdateHouseDto, id: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: { contracts: true, prices: true },
    })

    Object.assign(house, dto)

    if (dto.contractIds) {
      house.contracts = dto.contractIds.map((id) => ({ id }) as Contract)
    }

    if (dto.price) {
      await this.housePriceService.deleteByHouseId(id)

      house.prices = this.housePricesConverterService.convert(dto.price, house)
    }

    const updatedHouse = await this.houseRepository.save(house)

    const houseWithRelations = await this.findById(updatedHouse.id)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  public async remove(id: string): Promise<void> {
    const res = await this.houseRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(House, id)
    }
  }
}
