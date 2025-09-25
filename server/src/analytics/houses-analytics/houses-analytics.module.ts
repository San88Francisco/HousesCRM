import { Module } from '@nestjs/common'
import { HousesAnalyticsService } from './houses-analytics.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'

@Module({
  imports: [TypeOrmModule.forFeature([House])],
  providers: [HousesAnalyticsService],
  exports: [HousesAnalyticsService],
})
export class HousesAnalyticsModule {}
