import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Test } from './entities/test.entity'
import { CreateTestDto } from './dto/create-test.dto'

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>
  ) {}

  public findAll(): Promise<Test[]> {
    return this.testRepository.find()
  }

  public async findOneById(id: string): Promise<Test | null> {
    const test = await this.testRepository.findOneBy({ id })
    if (!test) {
      throw new NotFoundException()
    }
    return test
  }

  public create(createTestDto: CreateTestDto): Promise<Test> {
    return this.testRepository.save(createTestDto)
  }
}
