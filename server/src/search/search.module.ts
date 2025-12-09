import { Module } from '@nestjs/common'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { House } from 'src/houses/entities/house.entity'
import { Contract } from 'src/contracts/entities/contract.entity'
import { Renter } from 'src/renters/entities/renter.entity'

@Module({
  imports: [TypeOrmModule.forFeature([House, Contract, Renter])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
