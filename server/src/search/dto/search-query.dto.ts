import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SearchQueryDto {
  @ApiProperty({ description: 'Term to search across houses, renters and contracts' })
  @IsString()
  @IsNotEmpty()
  term: string
}
