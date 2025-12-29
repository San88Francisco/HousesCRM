import { Contract } from 'src/contracts/entities/contract.entity'
import { HousePrice } from 'src/house-prices/entities/house-price.entity'
import type { Relation } from 'typeorm'
import { Check, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum ApartmentType {
  NEW_BUILD = 'new_build',
  RESALE = 'resale',
}
@Entity()
@Check('"rooms_count" > 0 AND "total_area" > 0 AND "floor" >= 0')
export class House {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'apartment_name', length: 45 })
  apartmentName: string

  @Column({ name: 'rooms_count' })
  roomsCount: number

  @Column({ name: 'total_area', type: 'float' })
  totalArea: number

  @Column({ name: 'purchase_date' })
  purchaseDate: Date

  @Column()
  floor: number

  @Column({ length: 45 })
  street: string

  @Column({ type: 'enum', enum: ApartmentType, default: ApartmentType.NEW_BUILD })
  apartmentType: ApartmentType

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => HousePrice, (price) => price.house, { cascade: true })
  prices: Relation<HousePrice>[]

  @OneToMany(() => Contract, (contract) => contract.house)
  contracts: Relation<Contract>[]
}
