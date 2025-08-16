import { IsString } from 'class-validator'

export class CreateTestDto {
  @IsString()
  public name: string
}
