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
  public id: string

  @Column()
  public commencement: Date

  @Column()
  public termination: Date

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.ACTIVE })
  public status: ContractStatus

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @Column({ name: 'monthly_payment' })
  public monthlyPayment: number

  @ManyToOne(() => House, (house) => house.contracts, { onDelete: 'CASCADE' })
  public house: Relation<House>

  @ManyToOne(() => Renter, (renter) => renter.contracts)
  public renter: Relation<Renter>
}
