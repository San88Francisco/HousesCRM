import { Module } from '@nestjs/common'
import { RentersService } from './renters.service'
import { RentersController } from './renters.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Renter } from './entities/renter.entity'
import { AnalyticsModule } from 'src/analytics/analytics.module'
import { ExchangeRatesModule } from 'src/exchange-rates/exchange-rates.module'

@Module({
  imports: [TypeOrmModule.forFeature([Renter]), AnalyticsModule, ExchangeRatesModule],
  controllers: [RentersController],
  providers: [RentersService],
  exports: [RentersService],
})
export class RentersModule {}
