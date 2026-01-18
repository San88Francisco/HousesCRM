import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract } from 'src/contracts/entities/contract.entity'
import { HousePriceService } from 'src/house-prices/house-price.service'
import { HousePricesConverterService } from 'src/house-prices/house-prices.converter.service'
import { Between, EntityNotFoundError, Repository } from 'typeorm'
import { HOUSE_QUERY_DEFAULTS } from './constants/house-query.constant'
import { CreateHouseDto } from './dto/create-house.dto'
import { HouseQueryDto } from './dto/house-query.dto'
import { HouseWithPricesDto } from './dto/house-with-prices.dto'
import { HouseWithRelationsDto } from './dto/house-with-relations.dto'
import { HouseResponseDto } from './dto/houses-response.dto'
import { UpdateHouseDto } from './dto/update-house.dto'
import { House } from './entities/house.entity'

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    private housePriceService: HousePriceService,
    private housePricesConverterService: HousePricesConverterService
  ) {}

  async findAll(dto: HouseQueryDto, userId: string): Promise<HouseResponseDto> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      order = QUERY_DEFAULTS.ORDER,
      sortBy = QUERY_DEFAULTS.SORT_BY,
      minPrice = HOUSE_QUERY_DEFAULTS.MIN_PRICE,
      maxPrice = HOUSE_QUERY_DEFAULTS.MAX_PRICE,
      currency = HOUSE_QUERY_DEFAULTS.CURRENCY,
      ...filters
    } = dto

    const computedSortFields = new Set(['totalRevenue', 'rentersCount', 'currentPayment'])

    const orderField = computedSortFields.has(sortBy as string) ? QUERY_DEFAULTS.SORT_BY : sortBy

    const [houses, total] = await this.houseRepository.findAndCount({
      relations: { prices: true },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [orderField]: order,
      },
      where: {
        userId,
        ...filters,
        prices: {
          amount: Between(minPrice, maxPrice),
          code: currency,
        },
      },
    })

    const housesDto = plainToInstance(HouseWithPricesDto, houses, {
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

    return plainToInstance(HouseResponseDto, rawData, {
      excludeExtraneousValues: true,
    })
  }

  async findById(id: string, userId: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id, userId },
      relations: {
        prices: true,
      },
    })

    return plainToInstance(HouseWithRelationsDto, house, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateHouseDto, userId: string): Promise<HouseWithRelationsDto> {
    const houseToSave = this.houseRepository.create({
      ...dto,
      userId,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    houseToSave.prices = await this.housePricesConverterService.convert(dto.price, houseToSave)

    const savedHouse = await this.houseRepository.save(houseToSave)

    const houseWithRelations = await this.findById(savedHouse.id, userId)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateHouseDto, id: string, userId: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id, userId },
      relations: { contracts: true, prices: true },
    })

    Object.assign(house, dto)

    if (dto.contractIds) {
      house.contracts = dto.contractIds.map((id) => ({ id }) as Contract)
    }

    if (dto.price) {
      await this.housePriceService.deleteByHouseId(id)

      house.prices = await this.housePricesConverterService.convert(dto.price, house)
    }

    const updatedHouse = await this.houseRepository.save(house)

    const houseWithRelations = await this.findById(updatedHouse.id, userId)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    const house = await this.houseRepository.findOne({
      where: { id, userId },
    })

    if (!house) {
      throw new EntityNotFoundError(House, id)
    }

    await this.houseRepository.remove(house)
  }
}
