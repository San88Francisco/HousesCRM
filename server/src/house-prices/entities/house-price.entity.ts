import { House } from 'src/houses/entities/house.entity'
import { CurrencyCode } from 'src/house-prices/enums/currency-code.enum'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class HousePrice {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  public amount: number

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 12, scale: 2, nullable: false })
  public exchangeRate: number

  @Column({ type: 'enum', enum: CurrencyCode })
  public code: CurrencyCode

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @ManyToOne(() => House, (house) => house.prices, { onDelete: 'CASCADE', nullable: false })
  public house: Relation<House>
}
