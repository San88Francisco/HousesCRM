import { PickType } from '@nestjs/swagger'
import { RenterDto } from 'src/renters/dto/renter.dto'

export class RenterSubsetDto extends PickType(RenterDto, ['id', 'firstName', 'lastName'] as const) {}
