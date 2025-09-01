import { Contract } from 'src/contracts/entities/contract.entity'
import { User } from 'src/users/entities/user.entity'
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { Relation } from 'typeorm'
import { ApartmentType } from '../enums/apartment-type.enum'

@Entity()
// eslint-disable-next-line quotes
@Check(`"rooms_count" > 0 AND "total_area" > 0 AND "price_uah" > 0 AND "usd_rate" > 0 AND "floor" >= 0`)
export class House {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ name: 'apartment_name', length: 30 })
  public apartmentName: string

  @Column({ name: 'rooms_count' })
  public roomsCount: number

  @Column({ name: 'total_area', type: 'float' })
  public totalArea: number

  @Column({ name: 'purchase_date' })
  public purchaseDate: Date

  @Column({ name: 'price_uah' })
  public priceUah: number

  @Column({ name: 'usd_rate', type: 'float' })
  public usdRate: number

  @Column()
  public floor: number

  @Column()
  public street: string

  @Column({ name: 'apartment_type', type: 'enum', enum: ApartmentType, default: ApartmentType.NEW_BUILD })
  public apartmentType: ApartmentType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @ManyToOne(() => User, (user) => user.houses)
  public user: Relation<User>

  @OneToMany(() => Contract, (contract) => contract.house)
  public contracts: Relation<Contract>
}
