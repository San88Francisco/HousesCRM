import { BadRequestException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { HousesService } from 'src/houses/houses.service'
import { MeterReading } from './entities/meter-reading.entity'
import { UtilityTariff } from './entities/utility-tariff.entity'
import { UtilityType } from './entities/utility-type.enum'
import { MeterReadingsService } from './meter-readings.service'
import { UtilityTariffsService } from './utility-tariffs.service'

// ─── fakes ───────────────────────────────────────────────────────────────────

type FakeReadingRepo = {
  find: jest.Mock
  findOne: jest.Mock
  create: jest.Mock
  save: jest.Mock
  remove: jest.Mock
}

const makeReading = (overrides: Partial<MeterReading>): MeterReading =>
  ({
    id: 'reading-1',
    utilityType: UtilityType.ELECTRICITY,
    value: 0,
    readingDate: '2026-01-01',
    createdAt: new Date('2026-01-01T10:00:00Z'),
    houseId: 'house-1',
    ...overrides,
  }) as MeterReading

const makeTariff = (overrides: Partial<UtilityTariff>): UtilityTariff =>
  ({
    id: 'tariff-1',
    utilityType: UtilityType.ELECTRICITY,
    pricePerUnit: 4.32,
    validFrom: '2026-01-01',
    createdAt: new Date('2026-01-01T10:00:00Z'),
    userId: 'user-1',
    ...overrides,
  }) as UtilityTariff

// ─── test suite ──────────────────────────────────────────────────────────────

describe('MeterReadingsService', () => {
  let service: MeterReadingsService
  let readingRepo: FakeReadingRepo
  let housesService: { findById: jest.Mock }
  let tariffEntities: UtilityTariff[]

  beforeEach(async () => {
    readingRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((dto: Partial<MeterReading>) => dto as MeterReading),
      save: jest.fn((entity: Partial<MeterReading>) =>
        Promise.resolve({ id: 'new-reading', createdAt: new Date(), ...entity } as MeterReading)
      ),
      remove: jest.fn(),
    }
    housesService = { findById: jest.fn().mockResolvedValue({ id: 'house-1' }) }
    tariffEntities = []

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeterReadingsService,
        UtilityTariffsService,
        { provide: getRepositoryToken(MeterReading), useValue: readingRepo },
        {
          provide: getRepositoryToken(UtilityTariff),
          useValue: {
            find: jest.fn(({ where }: { where: { utilityType?: UtilityType } }) =>
              Promise.resolve(
                where?.utilityType
                  ? tariffEntities.filter((tariff) => tariff.utilityType === where.utilityType)
                  : tariffEntities
              )
            ),
          },
        },
        { provide: HousesService, useValue: housesService },
      ],
    }).compile()

    service = module.get(MeterReadingsService)
  })

  describe('findAll', () => {
    it('marks the first reading as a baseline without consumption or cost', async () => {
      readingRepo.find.mockResolvedValue([makeReading({ value: 1100, readingDate: '2026-06-01' })])
      tariffEntities = [makeTariff({ pricePerUnit: 4.32, validFrom: '2026-01-01' })]

      const result = await service.findAll('house-1', 'user-1')

      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toMatchObject({
        previousValue: null,
        consumption: null,
        tariffPrice: null,
        cost: null,
        unit: 'кВт·год',
      })
    })

    it('computes consumption and cost from the previous reading and the active tariff', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'r1', value: 1100, readingDate: '2026-06-01' }),
        makeReading({ id: 'r2', value: 1250, readingDate: '2026-07-01' }),
      ])
      tariffEntities = [makeTariff({ pricePerUnit: 4.32, validFrom: '2026-01-01' })]

      const result = await service.findAll('house-1', 'user-1')

      // newest first
      expect(result.data[0]).toMatchObject({
        id: 'r2',
        previousValue: 1100,
        consumption: 150,
        tariffPrice: 4.32,
        cost: 648,
      })
      expect(result.data[1]).toMatchObject({ id: 'r1', consumption: null, cost: null })
    })

    it('applies the tariff valid on the reading date (boundary inclusive)', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'r1', value: 1000, readingDate: '2026-05-31' }),
        makeReading({ id: 'r2', value: 1100, readingDate: '2026-06-30' }),
        makeReading({ id: 'r3', value: 1200, readingDate: '2026-07-01' }),
      ])
      tariffEntities = [
        makeTariff({ id: 't1', pricePerUnit: 4.32, validFrom: '2026-01-01' }),
        makeTariff({ id: 't2', pricePerUnit: 5, validFrom: '2026-07-01' }),
      ]

      const result = await service.findAll('house-1', 'user-1')

      expect(result.data[0]).toMatchObject({ id: 'r3', tariffPrice: 5, cost: 500 })
      expect(result.data[1]).toMatchObject({ id: 'r2', tariffPrice: 4.32, cost: 432 })
    })

    it('returns null cost when no tariff exists', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'r1', value: 1100, readingDate: '2026-06-01' }),
        makeReading({ id: 'r2', value: 1250, readingDate: '2026-07-01' }),
      ])
      tariffEntities = []

      const result = await service.findAll('house-1', 'user-1')

      expect(result.data[0]).toMatchObject({ consumption: 150, tariffPrice: null, cost: null })
    })

    it('rounds cost to two decimals', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'r1', value: 1000, readingDate: '2026-06-01' }),
        makeReading({ id: 'r2', value: 1137, readingDate: '2026-07-01' }),
      ])
      tariffEntities = [makeTariff({ pricePerUnit: 4.32, validFrom: '2026-01-01' })]

      const result = await service.findAll('house-1', 'user-1')

      expect(result.data[0]).toMatchObject({ consumption: 137, cost: 591.84 })
    })
  })

  describe('create', () => {
    it('rejects a reading dated on or before the latest one', async () => {
      readingRepo.findOne.mockResolvedValue(makeReading({ value: 1250, readingDate: '2026-07-01' }))

      await expect(
        service.create('house-1', { value: 1300, readingDate: new Date('2026-07-01') }, 'user-1')
      ).rejects.toThrow(BadRequestException)
      expect(readingRepo.save).not.toHaveBeenCalled()
    })

    it('rejects a value lower than the previous reading', async () => {
      readingRepo.findOne.mockResolvedValue(makeReading({ value: 1250, readingDate: '2026-07-01' }))

      await expect(
        service.create('house-1', { value: 1200, readingDate: new Date('2026-08-01') }, 'user-1')
      ).rejects.toThrow(BadRequestException)
      expect(readingRepo.save).not.toHaveBeenCalled()
    })

    it('saves a valid reading and returns the computed result', async () => {
      readingRepo.findOne.mockResolvedValue(makeReading({ value: 1100, readingDate: '2026-06-01' }))
      tariffEntities = [makeTariff({ pricePerUnit: 4.32, validFrom: '2026-01-01' })]

      const result = await service.create('house-1', { value: 1250, readingDate: new Date('2026-07-01') }, 'user-1')

      expect(readingRepo.save).toHaveBeenCalled()
      expect(result).toMatchObject({
        value: 1250,
        previousValue: 1100,
        consumption: 150,
        tariffPrice: 4.32,
        cost: 648,
      })
    })

    it('saves the first reading as a baseline', async () => {
      readingRepo.findOne.mockResolvedValue(null)

      const result = await service.create('house-1', { value: 1100, readingDate: new Date('2026-06-01') }, 'user-1')

      expect(result).toMatchObject({ value: 1100, previousValue: null, consumption: null, cost: null })
    })

    it('verifies house ownership before creating', async () => {
      await service.create('house-1', { value: 1100, readingDate: new Date('2026-06-01') }, 'user-1')

      expect(housesService.findById).toHaveBeenCalledWith('house-1', 'user-1')
    })

    it('rejects a metered reading without a value', async () => {
      await expect(
        service.create(
          'house-1',
          { readingDate: new Date('2026-06-01'), utilityType: UtilityType.WATER_COLD },
          'user-1'
        )
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('non-metered utility (garbage)', () => {
    it('creates a monthly charge without a value: cost = current tariff', async () => {
      tariffEntities = [makeTariff({ utilityType: UtilityType.GARBAGE, pricePerUnit: 120, validFrom: '2026-01-01' })]

      const result = await service.create(
        'house-1',
        { readingDate: new Date('2026-06-01'), utilityType: UtilityType.GARBAGE },
        'user-1'
      )

      expect(result).toMatchObject({
        previousValue: null,
        consumption: null,
        tariffPrice: 120,
        cost: 120,
        unit: 'міс',
      })
    })

    it('every charge has a cost, not only after a baseline', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'g1', utilityType: UtilityType.GARBAGE, value: 0, readingDate: '2026-05-01' }),
        makeReading({ id: 'g2', utilityType: UtilityType.GARBAGE, value: 0, readingDate: '2026-06-01' }),
      ])
      tariffEntities = [makeTariff({ utilityType: UtilityType.GARBAGE, pricePerUnit: 120, validFrom: '2026-01-01' })]

      const result = await service.findAll('house-1', 'user-1', UtilityType.GARBAGE)

      expect(result.data[0]).toMatchObject({ cost: 120 })
      expect(result.data[1]).toMatchObject({ cost: 120 })
    })
  })

  describe('getSummary', () => {
    it('groups costs by month across utility types with totals', async () => {
      readingRepo.find.mockResolvedValue([
        makeReading({ id: 'e1', value: 1100, readingDate: '2026-06-01' }),
        makeReading({ id: 'e2', value: 1250, readingDate: '2026-07-01' }),
        makeReading({ id: 'g1', utilityType: UtilityType.GARBAGE, value: 0, readingDate: '2026-07-05' }),
      ])
      tariffEntities = [
        makeTariff({ pricePerUnit: 4.32, validFrom: '2026-01-01' }),
        makeTariff({ id: 't-g', utilityType: UtilityType.GARBAGE, pricePerUnit: 150, validFrom: '2026-01-01' }),
      ]

      const result = await service.getSummary('house-1', 'user-1')

      // червень містить лише базовий показник світла (без вартості) — місяць не потрапляє у зведення
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toMatchObject({
        month: '2026-07',
        total: 798,
        costs: { electricity: 648, garbage: 150 },
      })
    })
  })
})
