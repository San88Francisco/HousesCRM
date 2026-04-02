import { Module } from '@nestjs/common'
import { RentersService } from './renters.service'
import { RentersController } from './renters.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { AnalyticsModule } from 'src/analytics/analytics.module'
import { Renter } from './entities/renter.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Renter, Contract]), AnalyticsModule],
  controllers: [RentersController],
  providers: [RentersService],
  exports: [RentersService],
})
export class RentersModule {}
