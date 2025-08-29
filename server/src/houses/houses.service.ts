import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { House } from './entities/house.entity'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateHouseDto } from './dto/create-house.dto'
import { HouseDto } from './dto/house.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateHouseDto } from './dto/update-house.dto'
import { HousePriceService } from 'src/house-prices/house-price.service'
import { HouseWithPricesDto } from './dto/house-with-prices.dto'
import { HousePricesConverterService } from 'src/house-prices/house-prices.converter.service'

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    private housePriceService: HousePriceService,
    private housePricesConverterService: HousePricesConverterService
  ) {}

  public async findAll(): Promise<HouseDto[]> {
    const houses = await this.houseRepository.find()

    return plainToInstance(HouseDto, houses, {
      excludeExtraneousValues: true,
    })
  }

  public async findById(id: string): Promise<HouseWithPricesDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: { prices: true },
    })

    return plainToInstance(HouseWithPricesDto, house, {
      excludeExtraneousValues: true,
    })
  }

  public async create(dto: CreateHouseDto, userId: string): Promise<HouseWithPricesDto> {
    const entity = this.houseRepository.create({
      ...dto,
      user: {
        id: userId,
      },
    })

    entity.prices = this.housePricesConverterService.convert(dto.price, entity)

    const newHouse = await this.houseRepository.save(entity)

    return plainToInstance(HouseWithPricesDto, newHouse, {
      excludeExtraneousValues: true,
    })
  }

  public async update(dto: UpdateHouseDto, id: string): Promise<HouseWithPricesDto> {
    const house = await this.houseRepository.findOneOrFail({
      where: { id },
      relations: { prices: true },
    })

    Object.assign(house, dto)

    if (dto.price) {
      await this.housePriceService.deleteByHouseId(id)

      house.prices = this.housePricesConverterService.convert(dto.price, house)
    }

    const updatedHouse = await this.houseRepository.save(house)

    return plainToInstance(HouseWithPricesDto, updatedHouse, {
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
