import { Expose } from 'class-transformer'

export class ContractPdfFileDto {
  @Expose()
  renterFirstName: string

  @Expose()
  renterLastName: string

  @Expose()
  roomsCount: number

  @Expose()
  totalArea: number

  @Expose()
  street: string

  @Expose()
  apartmentName: string

  @Expose()
  commencement: Date

  @Expose()
  monthlyPayment: number
}
