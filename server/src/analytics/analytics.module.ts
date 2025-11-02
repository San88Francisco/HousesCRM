import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'
import { HouseDetailAnalyticsService } from './house-detail-analytics/house-detail-analytics.service'
import { HousesAnalyticsService } from './houses-analytics/houses-analytics.service'
import { Contract } from 'src/contracts/entities/contract.entity'

@Module({
  imports: [TypeOrmModule.forFeature([House, Contract])],
  providers: [HousesAnalyticsService, HouseDetailAnalyticsService],
  exports: [HousesAnalyticsService, HouseDetailAnalyticsService],
})
export class AnalyticsModule {}
