import { Expose } from 'class-transformer'

export class ContractPdfFileDto {
  @Expose()
  renterFirstName: string

  @Expose()
  renterLastName: string

  @Expose()
  roomsCount: number

  @Expose()
  street: string

  @Expose()
  commencement: Date

  @Expose()
  monthlyPayment: number
}
