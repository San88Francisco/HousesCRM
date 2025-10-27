import { House } from 'src/houses/entities/house.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

export enum CurrencyCode {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
}

@Entity()
export class HousePrice {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  amount: number

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 12, scale: 2, nullable: false })
  exchangeRate: number

  @Column({ type: 'enum', enum: CurrencyCode, default: CurrencyCode.UAH })
  code: CurrencyCode

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => House, (house) => house.prices, { onDelete: 'CASCADE', nullable: false })
  house: Relation<House>
}
