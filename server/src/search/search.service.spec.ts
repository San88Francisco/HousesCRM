import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, type TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Contract } from 'src/contracts/entities/contract.entity'
import { House } from 'src/houses/entities/house.entity'
import { Renter } from 'src/renters/entities/renter.entity'
import { SearchService } from './search.service'

// ─── repo builder ────────────────────────────────────────────────────────────

type FakeQb = {
  where: jest.Mock
  andWhere: jest.Mock
  innerJoin: jest.Mock
  innerJoinAndSelect: jest.Mock
  getMany: jest.Mock
}

type FakeRepo = { createQueryBuilder: jest.Mock }

function makeQb(results: object[]): FakeQb {
  return {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(results),
  }
}

function makeRepo(rows: object[] = []): FakeRepo {
  return {
    createQueryBuilder: jest.fn(() => makeQb(rows)),
  }
}

// ─── test suite ──────────────────────────────────────────────────────────────

describe('SearchService', () => {
  let service: SearchService
  let cache: { get: jest.Mock; set: jest.Mock }
  let housesRepo: FakeRepo
  let contractsRepo: FakeRepo
  let rentersRepo: FakeRepo

  beforeEach(async () => {
    cache = { get: jest.fn(), set: jest.fn().mockResolvedValue(undefined) }
    housesRepo = makeRepo()
    contractsRepo = makeRepo()
    rentersRepo = makeRepo()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: CACHE_MANAGER, useValue: cache },
        { provide: getRepositoryToken(House), useValue: housesRepo },
        { provide: getRepositoryToken(Contract), useValue: contractsRepo },
        { provide: getRepositoryToken(Renter), useValue: rentersRepo },
      ],
    }).compile()

    service = module.get(SearchService)
  })

  // ── empty / blank term ────────────────────────────────────────────────────

  describe('empty term', () => {
    it('returns empty result for undefined term without touching cache or DB', async () => {
      const result = await service.search({ term: undefined as unknown as string }, 'user-1')

      expect(result).toMatchObject({ houses: [], renters: [], contracts: [] })
      expect(cache.get).not.toHaveBeenCalled()
      expect(cache.set).not.toHaveBeenCalled()
      expect(housesRepo.createQueryBuilder).not.toHaveBeenCalled()
    })

    it('returns empty result for whitespace-only term', async () => {
      const result = await service.search({ term: '   ' }, 'user-1')

      expect(result).toMatchObject({ houses: [], renters: [], contracts: [] })
      expect(cache.get).not.toHaveBeenCalled()
    })
  })

  // ── cache hit ─────────────────────────────────────────────────────────────

  describe('cache hit', () => {
    it('returns cached result without querying repositories', async () => {
      const cached = { houses: [{ id: 'h1' }], renters: [], contracts: [] }
      cache.get.mockResolvedValueOnce(cached)

      const result = await service.search({ term: 'соборна' }, 'user-1')

      expect(result).toEqual(cached)
      expect(cache.set).not.toHaveBeenCalled()
      expect(housesRepo.createQueryBuilder).not.toHaveBeenCalled()
      expect(contractsRepo.createQueryBuilder).not.toHaveBeenCalled()
      expect(rentersRepo.createQueryBuilder).not.toHaveBeenCalled()
    })
  })

  // ── cache miss ────────────────────────────────────────────────────────────

  describe('cache miss', () => {
    it('queries all three repositories and writes result to cache', async () => {
      cache.get.mockResolvedValueOnce(null)

      await service.search({ term: 'квартира' }, 'user-42')

      expect(housesRepo.createQueryBuilder).toHaveBeenCalledTimes(1)
      expect(contractsRepo.createQueryBuilder).toHaveBeenCalledTimes(1)
      expect(rentersRepo.createQueryBuilder).toHaveBeenCalledTimes(1)
      expect(cache.set).toHaveBeenCalledTimes(1)
    })

    it('stores result with 30-day TTL (±1 min tolerance)', async () => {
      cache.get.mockResolvedValueOnce(null)

      await service.search({ term: 'рівне' }, 'user-1')

      const [_key, _value, ttl] = cache.set.mock.calls[0] as [string, unknown, number]
      const MONTH_MS = 30 * 24 * 60 * 60 * 1000
      expect(ttl).toBe(MONTH_MS)
    })
  })

  // ── cache key format ──────────────────────────────────────────────────────

  describe('cache key', () => {
    it('includes userId so different users do not share results', async () => {
      cache.get.mockResolvedValue(null)

      await service.search({ term: 'квартира' }, 'user-A')
      await service.search({ term: 'квартира' }, 'user-B')

      const keyA = (cache.get.mock.calls[0] as [string])[0]
      const keyB = (cache.get.mock.calls[1] as [string])[0]
      expect(keyA).not.toBe(keyB)
      expect(keyA).toContain('user-A')
      expect(keyB).toContain('user-B')
    })

    it('normalises term to lowercase so "Квартира" and "квартира" hit same key', async () => {
      cache.get.mockResolvedValue(null)

      await service.search({ term: 'Квартира' }, 'user-1')
      await service.search({ term: 'квартира' }, 'user-1')

      const key1 = (cache.get.mock.calls[0] as [string])[0]
      const key2 = (cache.get.mock.calls[1] as [string])[0]
      expect(key1).toBe(key2)
    })

    it('trims whitespace so "  квартира  " and "квартира" hit same key', async () => {
      cache.get.mockResolvedValue(null)

      await service.search({ term: '  квартира  ' }, 'user-1')
      await service.search({ term: 'квартира' }, 'user-1')

      const key1 = (cache.get.mock.calls[0] as [string])[0]
      const key2 = (cache.get.mock.calls[1] as [string])[0]
      expect(key1).toBe(key2)
    })

    it('key follows the format search:{userId}:{term}', async () => {
      cache.get.mockResolvedValue(null)

      await service.search({ term: 'Test' }, 'u-99')

      const key = (cache.get.mock.calls[0] as [string])[0]
      expect(key).toBe('search:u-99:test')
    })
  })

  // ── result structure ──────────────────────────────────────────────────────

  describe('result structure', () => {
    it('always contains houses, renters and contracts keys', async () => {
      cache.get.mockResolvedValueOnce(null)

      const result = await service.search({ term: 'anything' }, 'user-1')

      expect(result).toHaveProperty('houses')
      expect(result).toHaveProperty('renters')
      expect(result).toHaveProperty('contracts')
    })
  })
})
