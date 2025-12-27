import { Module } from '@nestjs/common'
import { HousesService } from './houses.service'
import { HousesController } from './houses.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from './entities/house.entity'
import { ExchangeRatesModule } from 'src/exchange-rates/exchange-rates.module'
import { AnalyticsModule } from 'src/analytics/analytics.module'
@Module({
  imports: [TypeOrmModule.forFeature([House]), ExchangeRatesModule, AnalyticsModule],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
