import { Injectable } from '@nestjs/common'
import { HousePrice } from './entities/house-price.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class HousePriceService {
  constructor(
    @InjectRepository(HousePrice)
    private housePriceRepository: Repository<HousePrice>
  ) {}

  public async deleteByHouseId(houseId: string): Promise<void> {
    await this.housePriceRepository.delete({ house: { id: houseId } })
  }
}
