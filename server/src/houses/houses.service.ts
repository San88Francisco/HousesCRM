import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QUERY_DEFAULTS } from 'src/common/constants/query.constant'
import { Contract } from 'src/contracts/entities/contract.entity'
import { AmountInCurrencyDto } from 'src/exchange-rates/dto/amount-with-currencies.dto'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'
import { ExchangeRatesService } from 'src/exchange-rates/exchange-rates.service'
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
    private exchangeRatesService: ExchangeRatesService
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

    // Фільтрація по ціні: конвертуємо діапазон в UAH якщо потрібно
    let priceFilter = {}
    if (currency === CurrencyCode.UAH) {
      priceFilter = { price: Between(minPrice, maxPrice) }
    } else {
      // Якщо фільтрація по іншій валюті - треба конвертувати
      // Поки що простий варіант - завантажуємо всі і фільтруємо в пам'яті
    }

    const [houses] = await this.houseRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [orderField]: order,
      },
      where: {
        ...filters,
        ...priceFilter,
      },
    })

    const housesWithPrices = await Promise.all(
      houses.map(async (house) => {
        const prices = await this.calculatePricesForHouse(house)
        return { ...house, prices }
      })
    )

    let filteredHouses = housesWithPrices
    if (currency !== CurrencyCode.UAH) {
      filteredHouses = housesWithPrices.filter((house) => {
        const priceInCurrency = house.prices.find((p) => p.code === currency)
        return priceInCurrency && priceInCurrency.amount >= minPrice && priceInCurrency.amount <= maxPrice
      })
    }

    const housesDto = plainToInstance(HouseWithPricesDto, filteredHouses, {
      excludeExtraneousValues: true,
    })

    const rawData = {
      data: housesDto,
      meta: {
        total: filteredHouses.length,
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
    })

    const prices = await this.calculatePricesForHouse(house)
    const houseWithPrices = { ...house, prices }

    return plainToInstance(HouseWithRelationsDto, houseWithPrices, {
      excludeExtraneousValues: true,
    })
  }

  async create(dto: CreateHouseDto): Promise<HouseWithRelationsDto> {
    const houseToSave = this.houseRepository.create({
      ...dto,
      contracts: dto.contractIds?.map((id) => ({ id })),
    })

    const savedHouse = await this.houseRepository.save(houseToSave)

    return this.findById(savedHouse.id)
  }

  async update(dto: UpdateHouseDto, id: string): Promise<HouseWithRelationsDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: { contracts: true },
    })

    Object.assign(house, dto)

    if (dto.contractIds) {
      house.contracts = dto.contractIds.map((id) => ({ id }) as Contract)
    }

    await this.houseRepository.save(house)

    return this.findById(id)
  }

  async remove(id: string): Promise<void> {
    const res = await this.houseRepository.delete(id)

    if (res.affected === 0) {
      throw new EntityNotFoundError(House, id)
    }
  }

  private async calculatePricesForHouse(house: House): Promise<AmountInCurrencyDto[]> {
    // Отримуємо курси за датою покупки (з кешуванням)
    const rates = await this.exchangeRatesService.getExchangeRatesForDate(house.purchaseDate)

    // Конвертуємо ціну в усі валюти з округленням до сотих
    return Object.entries(rates).map(([code, rate]) => ({
      code: code as CurrencyCode,
      amount: Number((house.price / rate).toFixed(2)), // Округлення до сотих
      exchangeRate: Number(rate.toFixed(4)), // Курс з точністю НБУ (4 знаки)
    }))
  }
}
