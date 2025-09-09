import { Module } from '@nestjs/common'
import { HousePriceService } from './house-price.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HousePrice } from './entities/house-price.entity'
import { HousePricesConverterService } from './house-prices.converter.service'

@Module({
  imports: [TypeOrmModule.forFeature([HousePrice])],
  providers: [HousePriceService, HousePricesConverterService],
  exports: [HousePriceService, HousePricesConverterService],
})
export class HousePriceModule {}
