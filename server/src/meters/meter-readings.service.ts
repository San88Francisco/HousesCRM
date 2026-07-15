import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { HousesService } from 'src/houses/houses.service'
import { EntityNotFoundError, IsNull, Not, Repository } from 'typeorm'
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

const hasAmount = (input: { amount?: number | null }): boolean => input.amount !== null && input.amount !== undefined

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

    const computedReadings = this.computeChain(readings, tariffs)

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
    const isManual = hasAmount(dto)
    const readingDate = toDateOnly(dto.readingDate)

    if (isMetered && !isManual && (dto.value === undefined || dto.value === null)) {
      throw new BadRequestException('Вкажіть показник лічильника або суму без лічильника')
    }

    const latest = await this.readingRepository.findOne({
      where: { houseId, utilityType },
      order: { readingDate: 'DESC', createdAt: 'DESC' },
    })

    if (latest && readingDate <= latest.readingDate) {
      throw new BadRequestException(`Дата має бути пізнішою за дату попереднього запису (${latest.readingDate})`)
    }

    if (isMetered && !isManual) {
      const latestMetered = await this.findLatestMetered(houseId, utilityType)

      if (latestMetered && (dto.value as number) < latestMetered.value) {
        throw new BadRequestException(`Новий показник не може бути меншим за попередній (${latestMetered.value})`)
      }
    }

    const reading = this.readingRepository.create({
      houseId,
      utilityType,
      value: isMetered && !isManual ? (dto.value as number) : 0,
      amount: isManual ? (dto.amount as number) : null,
      readingDate,
    })

    const savedReading = await this.readingRepository.save(reading)

    const tariffs = await this.utilityTariffsService.findAllEntities(userId, utilityType)
    const previousMetered = isManual ? null : await this.findLatestMetered(houseId, utilityType, savedReading.id)

    return this.computeReading(savedReading, previousMetered, tariffs)
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

      this.computeChain(typeReadings, typeTariffs).forEach((computed, index) => {
        if (computed.cost === null) {
          return
        }

        const month = typeReadings[index].readingDate.slice(0, 7)
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

  private async findLatestMetered(
    houseId: string,
    utilityType: UtilityType,
    excludeId?: string
  ): Promise<MeterReading | null> {
    return this.readingRepository.findOne({
      where: {
        houseId,
        utilityType,
        amount: IsNull(),
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
      order: { readingDate: 'DESC', createdAt: 'DESC' },
    })
  }

  private computeChain(readings: MeterReading[], tariffs: UtilityTariff[]): MeterReadingDto[] {
    let previousMetered: MeterReading | null = null

    return readings.map((reading) => {
      if (hasAmount(reading)) {
        return this.computeManualReading(reading)
      }

      const computed = this.computeReading(reading, previousMetered, tariffs)
      previousMetered = reading

      return computed
    })
  }

  private toReadingDto(
    reading: MeterReading,
    computed: Pick<MeterReadingDto, 'value' | 'isManual' | 'previousValue' | 'consumption' | 'tariffPrice' | 'cost'>
  ): MeterReadingDto {
    return plainToInstance(
      MeterReadingDto,
      {
        id: reading.id,
        utilityType: reading.utilityType,
        readingDate: reading.readingDate,
        unit: UTILITY_UNITS[reading.utilityType],
        createdAt: reading.createdAt,
        ...computed,
      },
      { excludeExtraneousValues: true }
    )
  }

  private computeManualReading(reading: MeterReading): MeterReadingDto {
    return this.toReadingDto(reading, {
      value: null,
      isManual: true,
      previousValue: null,
      consumption: null,
      tariffPrice: null,
      cost: round2(reading.amount as number),
    })
  }

  private computeReading(
    reading: MeterReading,
    previous: MeterReading | null,
    tariffs: UtilityTariff[]
  ): MeterReadingDto {
    if (hasAmount(reading)) {
      return this.computeManualReading(reading)
    }

    const tariff = this.utilityTariffsService.resolveTariffForDate(tariffs, reading.readingDate)
    const isMetered = isMeteredUtility(reading.utilityType)

    const consumption = isMetered && previous ? round2(reading.value - previous.value) : null
    const hasCost = isMetered ? consumption !== null && tariff !== null : tariff !== null
    const cost = hasCost
      ? round2((isMetered ? (consumption as number) : 1) * (tariff as UtilityTariff).pricePerUnit)
      : null

    return this.toReadingDto(reading, {
      value: reading.value,
      isManual: false,
      previousValue: isMetered && previous ? previous.value : null,
      consumption,
      tariffPrice: hasCost ? (tariff as UtilityTariff).pricePerUnit : null,
      cost,
    })
  }
}
