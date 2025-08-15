import { IsNumber } from 'class-validator'

export class AppConfig {
  @IsNumber()
  public port: number
}
