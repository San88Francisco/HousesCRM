import { Module } from '@nestjs/common'
import { HousesAnalyticsService } from './houses-analytics.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'
import { HousesAnalyticsController } from './houses-analytics.controller'
import { HousesModule } from 'src/houses/houses.module'

@Module({
  imports: [TypeOrmModule.forFeature([House]), HousesModule],
  providers: [HousesAnalyticsService],
  controllers: [HousesAnalyticsController],
})
export class HousesAnalyticsModule {}
