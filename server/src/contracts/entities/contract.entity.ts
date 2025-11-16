import { House } from 'src/houses/entities/house.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { Renter } from 'src/renters/entities/renter.entity'

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

  @ManyToOne(() => House, (house) => house.contracts, { onDelete: 'CASCADE' })
  house: Relation<House>

  @ManyToOne(() => Renter, (renter) => renter.contracts)
  renter: Relation<Renter>
}
