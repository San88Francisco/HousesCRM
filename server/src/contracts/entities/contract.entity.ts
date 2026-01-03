import { House } from 'src/houses/entities/house.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { Renter } from 'src/renters/entities/renter.entity'
import { CurrencyCode } from 'src/exchange-rates/entities/exchange-rate.entity'

export enum ContractStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  commencement: Date

  @Column()
  termination: Date

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.ACTIVE })
  status: ContractStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'monthly_payment' })
  monthlyPayment: number

  @Column({
    type: 'enum',
    enum: CurrencyCode,
    default: CurrencyCode.UAH,
    name: 'payment_currency',
  })
  paymentCurrency: CurrencyCode

  @Column({ name: 'houseId' })
  houseId: string

  @ManyToOne(() => House, (house) => house.contracts, { onDelete: 'CASCADE' })
  house: Relation<House>

  @Column({ name: 'renterId' })
  renterId: string

  @ManyToOne(() => Renter, (renter) => renter.contracts)
  renter: Relation<Renter>
}
