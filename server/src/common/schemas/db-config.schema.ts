import { IsNumber, IsString } from 'class-validator'

export class DbConfig {
  @IsString()
  public host: string

  @IsNumber()
  public port: number

  @IsString()
  public username: string

  @IsString()
  public password: string

  @IsString()
  public database: string
}
