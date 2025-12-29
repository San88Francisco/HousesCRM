import { Module } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { ContractsController } from './contracts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { RentersModule } from 'src/renters/renters.module'

@Module({
  imports: [TypeOrmModule.forFeature([Contract]), RentersModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
