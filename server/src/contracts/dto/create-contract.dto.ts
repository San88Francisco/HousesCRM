import { IsDate, IsDefined, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import { ContractStatus } from '../entities/contract.entity'

export class CreateContractDto {
  @IsDefined({ message: 'commencement is required' })
  @IsDate({ message: 'commencement must be a valid date' })
  @Type(() => Date)
  commencement: Date

  @IsDefined({ message: 'termination is required' })
  @IsDate({ message: 'termination must be a valid date' })
  @Type(() => Date)
  termination: Date

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
