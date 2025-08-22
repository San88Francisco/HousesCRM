import { Controller } from '@nestjs/common'
import { HOUSES_ROUTES } from './constants/houses.routes'
import { HousesService } from './houses.service'

@Controller(HOUSES_ROUTES.ROOT)
export class HousesController {
  constructor(private readonly housesService: HousesService) {}
}
