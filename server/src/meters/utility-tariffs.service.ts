import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { EntityNotFoundError, Repository } from 'typeorm'
import { CreateUtilityTariffDto } from './dto/create-utility-tariff.dto'
import { UtilityTariffDto } from './dto/utility-tariff.dto'
import { UtilityTariff } from './entities/utility-tariff.entity'
import { UtilityType } from './entities/utility-type.enum'
import { toDateOnly } from './utils/date-only'

@Injectable()
export class UtilityTariffsService {
  constructor(
    @InjectRepository(UtilityTariff)
    private tariffRepository: Repository<UtilityTariff>
  ) {}

  async findAll(userId: string, utilityType: UtilityType = UtilityType.ELECTRICITY): Promise<UtilityTariffDto[]> {
    const tariffs = await this.findAllEntities(userId, utilityType)

    return plainToInstance(UtilityTariffDto, tariffs, {
      excludeExtraneousValues: true,
    })
  }

  async findAllEntities(userId: string, utilityType: UtilityType): Promise<UtilityTariff[]> {
    return this.tariffRepository.find({
      where: { userId, utilityType },
      order: { validFrom: 'DESC' },
    })
  }

  async findAllEntitiesForUser(userId: string): Promise<UtilityTariff[]> {
    return this.tariffRepository.find({
      where: { userId },
      order: { validFrom: 'DESC' },
    })
  }

  async create(dto: CreateUtilityTariffDto, userId: string): Promise<UtilityTariffDto> {
    const utilityType = dto.utilityType ?? UtilityType.ELECTRICITY
    const validFrom = toDateOnly(dto.validFrom)

    const existing = await this.tariffRepository.findOne({
      where: { userId, utilityType, validFrom },
    })

    if (existing) {
      throw new ConflictException('Тариф на цю дату вже існує')
    }

    const tariff = this.tariffRepository.create({
      utilityType,
      pricePerUnit: dto.pricePerUnit,
      validFrom,
      userId,
    })

    const savedTariff = await this.tariffRepository.save(tariff)

    return plainToInstance(UtilityTariffDto, savedTariff, {
      excludeExtraneousValues: true,
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    const tariff = await this.tariffRepository.findOne({
      where: { id, userId },
    })

    if (!tariff) {
      throw new EntityNotFoundError(UtilityTariff, id)
    }

    await this.tariffRepository.remove(tariff)
  }

  resolveTariffForDate(tariffs: UtilityTariff[], date: string): UtilityTariff | null {
    const sorted = [...tariffs].sort((a, b) => b.validFrom.localeCompare(a.validFrom))

    return sorted.find((tariff) => tariff.validFrom <= date) ?? null
  }
}
