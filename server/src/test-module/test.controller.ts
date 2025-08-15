import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { TestService } from './test.service'
import { Test } from './entities/test.entity'
import { CreateTestDto } from './dto/create-test.dto'
import { TEST_ROUTES } from './constants/test.routes'

@Controller(TEST_ROUTES.ROOT)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  public getAll(): Promise<Test[]> {
    return this.testService.findAll()
  }

  @Get(TEST_ROUTES.BY_ID)
  public getById(@Param('id') id: string): Promise<Test | null> {
    return this.testService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  public create(@Body() createTestDto: CreateTestDto): Promise<Test> {
    return this.testService.create(createTestDto)
  }
}
