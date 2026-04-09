import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ContractPdfProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landlordPip?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landlordPassportNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landlordPassportIssued?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inspectionCount?: string
}
