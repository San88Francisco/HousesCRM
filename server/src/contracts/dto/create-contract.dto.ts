import {
  IsDate,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateIf,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ContractStatus } from '../entities/contract.entity'

function parseTerminationPayload(value: unknown): Date | string | null | undefined {
  if (value === 'new' || value === 'NEW') {
    return null
  }
  if (value === null || value === undefined) {
    return value
  }
  if (value instanceof Date) {
    return value
  }
  if (typeof value === 'string') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? value : d
  }
  return value as Date | string
}

export class CreateContractDto {
  @IsDefined({ message: 'commencement is required' })
  @IsDate({ message: 'commencement must be a valid date' })
  @Type(() => Date)
  commencement: Date

  @Transform(({ value }) => parseTerminationPayload(value))
  @ValidateIf((o: CreateContractDto) => o.status === ContractStatus.INACTIVE)
  @IsNotEmpty({ message: 'termination is required for inactive contract' })
  @IsDate({ message: 'termination must be a valid date' })
  @ValidateIf((o: CreateContractDto) => o.status === ContractStatus.ACTIVE)
  @IsOptional()
  termination: Date | null

  @IsDefined({ message: 'contractStatus is required' })
  @IsEnum(ContractStatus, { message: 'contractStatus must be a valid enum value' })
  status: ContractStatus

  @IsDefined({ message: 'monthlyPayment is required' })
  @IsNumber({}, { message: 'monthlyPayment must be a number' })
  @IsPositive({ message: 'monthlyPayment must be positive' })
  monthlyPayment: number

  @IsOptional()
  @IsUUID('4', { message: 'houseId must be a valid UUID' })
  houseId?: string

  @IsOptional()
  @IsUUID('4', { message: 'renterId must be a valid UUID' })
  renterId?: string
}
