import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import { ContractPdfProfileDto } from './contract-pdf-profile.dto'

export class ProfileResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  username: string

  @ApiPropertyOptional({ type: () => ContractPdfProfileDto })
  @IsOptional()
  contractPdfProfile?: ContractPdfProfileDto | null
}
