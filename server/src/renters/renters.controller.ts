import { Controller } from '@nestjs/common'
import { RentersService } from './renters.service'
import { RENTERS_ROUTES } from './constants/renters.routes'

@Controller(RENTERS_ROUTES.ROOT)
export class RentersController {
  constructor(private readonly rentersService: RentersService) {}
}
