import { Controller } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { CONTRACTS_ROUTES } from './constants/contracts.routes'

@Controller(CONTRACTS_ROUTES.ROOT)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}
}
