import { Module } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { ContractsController } from './contracts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'
import { RentersModule } from 'src/renters/renters.module'
import { Contract } from './entities/contract.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Contract, House]), RentersModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
