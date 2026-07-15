import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { HousesService } from 'src/houses/houses.service'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateMeterReadingDto } from './dto/create-meter-reading.dto'
import { MeterReadingDto } from './dto/meter-reading.dto'
import { MeterReadingsResponseDto } from './dto/meter-readings-response.dto'
import { UtilitySummaryResponseDto } from './dto/utility-summary.dto'
import { MeterReading } from './entities/meter-reading.entity'
import { UtilityTariff } from './entities/utility-tariff.entity'
import { UTILITY_UNITS, UtilityType, isMeteredUtility } from './entities/utility-type.enum'
import { toDateOnly } from './utils/date-only'
import { UtilityTariffsService } from './utility-tariffs.service'

const round2 = (value: number): number => Math.round(value * 100) / 100

@Injectable()
export class MeterReadingsService {
  constructor(
    @InjectRepository(MeterReading)
    private readingRepository: Repository<MeterReading>,
    private utilityTariffsService: UtilityTariffsService,
    private housesService: HousesService
  ) {}

  private async assertOwnership(houseId: string, userId: string): Promise<void> {
    await this.housesService.findById(houseId, userId)
  }

  async findAll(
    houseId: string,
    userId: string,
    utilityType: UtilityType = UtilityType.ELECTRICITY
  ): Promise<MeterReadingsResponseDto> {
    await this.assertOwnership(houseId, userId)

    const [readings, tariffs] = await Promise.all([
      this.readingRepository.find({
        where: { houseId, utilityType },
        order: { readingDate: 'ASC', createdAt: 'ASC' },
      }),
      this.utilityTariffsService.findAllEntities(userId, utilityType),
    ])

    const computedReadings = readings.map((reading, index) =>
      this.computeReading(reading, index > 0 ? readings[index - 1] : null, tariffs)
    )

    return plainToInstance(
      MeterReadingsResponseDto,
      { data: computedReadings.reverse() },
      { excludeExtraneousValues: true }
    )
  }

  async create(houseId: string, dto: CreateMeterReadingDto, userId: string): Promise<MeterReadingDto> {
    await this.assertOwnership(houseId, userId)

    const utilityType = dto.utilityType ?? UtilityType.ELECTRICITY
    const isMetered = isMeteredUtility(utilityType)
    const readingDate = toDateOnly(dto.readingDate)

    if (isMetered && (dto.value === undefined || dto.value === null)) {
      throw new BadRequestException('Для цієї послуги показник лічильника обов’язковий')
    }

    const latest = await this.readingRepository.findOne({
      where: { houseId, utilityType },
      order: { readingDate: 'DESC', createdAt: 'DESC' },
    })

    if (latest && readingDate <= latest.readingDate) {
      throw new BadRequestException(`Дата має бути пізнішою за дату попереднього запису (${latest.readingDate})`)
    }

    if (isMetered && latest && (dto.value as number) < latest.value) {
      throw new BadRequestException(`Новий показник не може бути меншим за попередній (${latest.value})`)
    }

    const reading = this.readingRepository.create({
      houseId,
      utilityType,
      value: isMetered ? (dto.value as number) : 0,
      readingDate,
    })

    const savedReading = await this.readingRepository.save(reading)

    const tariffs = await this.utilityTariffsService.findAllEntities(userId, utilityType)

    return this.computeReading(savedReading, latest, tariffs)
  }

  async getSummary(houseId: string, userId: string): Promise<UtilitySummaryResponseDto> {
    await this.assertOwnership(houseId, userId)

    const [readings, allTariffs] = await Promise.all([
      this.readingRepository.find({
        where: { houseId },
        order: { readingDate: 'ASC', createdAt: 'ASC' },
      }),
      this.utilityTariffsService.findAllEntitiesForUser(userId),
    ])

    const monthMap = new Map<string, { total: number; costs: Partial<Record<UtilityType, number>> }>()

    for (const utilityType of Object.values(UtilityType)) {
      const typeReadings = readings.filter((reading) => reading.utilityType === utilityType)
      const typeTariffs = allTariffs.filter((tariff) => tariff.utilityType === utilityType)

      typeReadings.forEach((reading, index) => {
        const computed = this.computeReading(reading, index > 0 ? typeReadings[index - 1] : null, typeTariffs)

        if (computed.cost === null) {
          return
        }

        const month = reading.readingDate.slice(0, 7)
        const entry = monthMap.get(month) ?? { total: 0, costs: {} }

        entry.costs[utilityType] = round2((entry.costs[utilityType] ?? 0) + computed.cost)
        entry.total = round2(entry.total + computed.cost)
        monthMap.set(month, entry)
      })
    }

    const data = [...monthMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, entry]) => ({ month, total: entry.total, costs: entry.costs }))

    return plainToInstance(UtilitySummaryResponseDto, { data }, { excludeExtraneousValues: true })
  }

  async remove(id: string, houseId: string, userId: string): Promise<void> {
    await this.assertOwnership(houseId, userId)

    const reading = await this.readingRepository.findOne({
      where: { id, houseId },
    })

    if (!reading) {
      throw new EntityNotFoundError(MeterReading, id)
    }

    await this.readingRepository.remove(reading)
  }

  private computeReading(
    reading: MeterReading,
    previous: MeterReading | null,
    tariffs: UtilityTariff[]
  ): MeterReadingDto {
    const tariff = this.utilityTariffsService.resolveTariffForDate(tariffs, reading.readingDate)
    const isMetered = isMeteredUtility(reading.utilityType)

    const consumption = isMetered && previous ? round2(reading.value - previous.value) : null
    const hasCost = isMetered ? consumption !== null && tariff !== null : tariff !== null
    const cost = hasCost
      ? round2((isMetered ? (consumption as number) : 1) * (tariff as UtilityTariff).pricePerUnit)
      : null

    return plainToInstance(
      MeterReadingDto,
      {
        id: reading.id,
        utilityType: reading.utilityType,
        value: reading.value,
        readingDate: reading.readingDate,
        previousValue: isMetered && previous ? previous.value : null,
        consumption,
        tariffPrice: hasCost ? (tariff as UtilityTariff).pricePerUnit : null,
        cost,
        unit: UTILITY_UNITS[reading.utilityType],
        createdAt: reading.createdAt,
      },
      { excludeExtraneousValues: true }
    )
  }
}
