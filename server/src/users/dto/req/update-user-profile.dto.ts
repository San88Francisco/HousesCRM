import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEmail, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'
import { ContractPdfProfileDto } from './contract-pdf-profile.dto'

export class UpdateUserProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний формат електронної пошти' })
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Ім'я користувача має містити щонайменше 3 символи" })
  username?: string

  @ApiPropertyOptional({ type: () => ContractPdfProfileDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractPdfProfileDto)
  contractPdfProfile?: ContractPdfProfileDto | null
}
