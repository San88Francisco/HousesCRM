import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HousesModule } from 'src/houses/houses.module'
import { MeterReading } from './entities/meter-reading.entity'
import { UtilityTariff } from './entities/utility-tariff.entity'
import { MeterReadingsController } from './meter-readings.controller'
import { MeterReadingsService } from './meter-readings.service'
import { UtilityTariffsController } from './utility-tariffs.controller'
import { UtilityTariffsService } from './utility-tariffs.service'

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading, UtilityTariff]), HousesModule],
  controllers: [MeterReadingsController, UtilityTariffsController],
  providers: [MeterReadingsService, UtilityTariffsService],
})
export class MetersModule {}
