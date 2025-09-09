import { Contract } from 'src/contracts/entities/contract.entity'
import { Check, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'
import { ApartmentType } from '../enums/apartment-type.enum'
import { HousePrice } from 'src/house-prices/entities/house-price.entity'

@Entity()
// eslint-disable-next-line quotes
@Check(`"rooms_count" > 0 AND "total_area" > 0 AND "floor" >= 0`)
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

  @OneToMany(() => HousePrice, (price) => price.house, { cascade: true })
  public prices: Relation<HousePrice>[]

  @OneToMany(() => Contract, (contract) => contract.house)
  public contracts: Relation<Contract>[]
}
