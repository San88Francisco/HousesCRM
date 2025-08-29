import { Module } from '@nestjs/common'
import { HousesService } from './houses.service'
import { HousesController } from './houses.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from './entities/house.entity'
import { HousePriceModule } from 'src/house-prices/house-price.module'
@Module({
  imports: [TypeOrmModule.forFeature([House]), HousePriceModule],
  controllers: [HousesController],
  providers: [HousesService],
})
export class HousesModule {}
