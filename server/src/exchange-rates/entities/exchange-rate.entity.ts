import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum CurrencyCode {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
  PLN = 'PLN',
}

@Entity('exchange_rates')
@Index(['date', 'code'], { unique: true })
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'date', nullable: false })
  date: Date

  @Column({ type: 'enum', enum: CurrencyCode, nullable: false })
  code: CurrencyCode

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: false })
  rate: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
