import { House } from 'src/houses/entities/house.entity'
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { Relation } from 'typeorm'
import { ContractStatus } from '../enums/contract-status.enum'
import { Renter } from 'src/renters/entities/renter.entity'

@Entity()
// eslint-disable-next-line quotes
@Check(`"monthly_payment" > 0`)
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public commencement: Date

  @Column()
  public termination: Date

  @Column({ name: 'monthly_payment' })
  public monthlyPayment: number

  @Column({ type: 'enum', enum: ContractStatus, default: ContractStatus.ACTIVE })
  public status: ContractStatus

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @ManyToOne(() => House, (house) => house.contracts, { onDelete: 'CASCADE' })
  public house: Relation<House>

  @OneToOne(() => Renter, (renter) => renter.contract)
  @JoinColumn()
  public renter: Relation<Renter>
}
