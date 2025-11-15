import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'
import { HouseDetailAnalyticsService } from './house-detail-analytics/house-detail-analytics.service'
import { HousesAnalyticsService } from './houses-analytics/houses-analytics.service'
import { Contract } from 'src/contracts/entities/contract.entity'
import { RenterDetailAnalyticsService } from './renter-detail-analytics/renter-detail-analytics.service'
import { HousesAnalyticsController } from './houses-analytics/houses-analytics.controller'

@Module({
  imports: [TypeOrmModule.forFeature([House, Contract])],
  providers: [HousesAnalyticsService, HouseDetailAnalyticsService, RenterDetailAnalyticsService],
  controllers: [HousesAnalyticsController],
  exports: [HousesAnalyticsService, HouseDetailAnalyticsService, RenterDetailAnalyticsService],
})
export class AnalyticsModule {}
