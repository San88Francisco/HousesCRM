import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract } from 'src/contracts/entities/contract.entity'
import { HousePriceService } from 'src/house-prices/house-price.service'
import { HousePricesConverterService } from 'src/house-prices/house-prices.converter.service'
import { Between, EntityNotFoundError, Repository } from 'typeorm'
import { HOUSE_QUERY_DEFAULTS } from './constants/house-query.constant'
import { CreateHouseDto } from './dto/create-house.dto'
import { GeocodeResponseDto } from './dto/geocode-response.dto'
import { HouseForMapDto } from './dto/house-for-map.dto'
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

  async findAll(dto: HouseQueryDto): Promise<HouseResponseDto> {
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

  async findById(id: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: {
        prices: true,
      },
    })

    return plainToInstance(HouseWithRelationsDto, house, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    const houseToSave = this.houseRepository.create({
      ...dto,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    houseToSave.prices = await this.housePricesConverterService.convert(dto.price, houseToSave)

    const savedHouse = await this.houseRepository.save(houseToSave)

    const houseWithRelations = await this.findById(savedHouse.id)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async update(dto: UpdateHouseDto, id: string): Promise<HouseWithRelationsDto> {
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

      house.prices = await this.housePricesConverterService.convert(dto.price, house)
    }

    const updatedHouse = await this.houseRepository.save(house)

    const houseWithRelations = await this.findById(updatedHouse.id)

    return plainToInstance(HouseWithRelationsDto, houseWithRelations, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string): Promise<void> {
    const res = await this.houseRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(House, id)
    }
  }

  async findAllForMap(): Promise<HouseForMapDto[]> {
    const houses = await this.houseRepository.find({
      select: ['id', 'apartmentName', 'street'],
    })

    return plainToInstance(HouseForMapDto, houses, {
      excludeExtraneousValues: true,
    })
  }

  async geocodeAddress(address: string, city: string): Promise<GeocodeResponseDto | null> {
    try {
      const query = address.includes(city) ? address : `${address}, ${city}`
      const encodedQuery = encodeURIComponent(query)

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=ua&addressdetails=1`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HousesCRM/1.0',
        },
      })

      if (!response.ok) {
        return null
      }

      interface NominatimResult {
        lat: string
        lon: string
        display_name: string
      }

      const data = (await response.json()) as NominatimResult[] | null

      if (!data || data.length === 0) {
        return null
      }

      const result = data[0]

      return plainToInstance(
        GeocodeResponseDto,
        {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
        },
        {
          excludeExtraneousValues: true,
        }
      )
    } catch (error) {
      Logger.error('Geocoding error:', error)
      return null
    }
  }
}
