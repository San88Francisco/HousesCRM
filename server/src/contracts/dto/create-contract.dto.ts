import { IsDate, IsDefined, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator'
import { ContractStatus } from '../enums/contract-status.enum'
import { Type } from 'class-transformer'

export class CreateContractDto {
  @IsDefined({ message: 'commencement is required' })
  @IsDate({ message: 'commencement must be a valid date' })
  @Type(() => Date)
  public commencement: Date

  @IsDefined({ message: 'termination is required' })
  @IsDate({ message: 'termination must be a valid date' })
  @Type(() => Date)
  public termination: Date

  @IsDefined({ message: 'contractStatus is required' })
  @IsEnum(ContractStatus, { message: 'contractStatus must be a valid enum value' })
  public status: ContractStatus

  @IsDefined({ message: 'monthlyPayment is required' })
  @IsNumber({}, { message: 'monthlyPayment must be a number' })
  @IsPositive({ message: 'monthlyPayment must be positive' })
  public monthlyPayment: number

  @IsOptional()
  @IsUUID('4', { message: 'houseId must be a valid UUID' })
  public houseId?: string

  @IsOptional()
  @IsUUID('4', { message: 'renterId must be a valid UUID' })
  public renterId?: string
}
