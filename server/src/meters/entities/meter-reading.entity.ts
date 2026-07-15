import { decimalTransformer } from 'src/common/utils/decimal.transformer'
import { House } from 'src/houses/entities/house.entity'
import type { Relation } from 'typeorm'
import { Check, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { UtilityType } from './utility-type.enum'

@Entity()
@Check('"value" >= 0')
@Unique(['houseId', 'utilityType', 'readingDate'])
@Index(['houseId', 'utilityType', 'readingDate'])
export class MeterReading {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'utility_type', type: 'enum', enum: UtilityType, default: UtilityType.ELECTRICITY })
  utilityType: UtilityType

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false, transformer: decimalTransformer })
  value: number

  @Column({ name: 'reading_date', type: 'date' })
  readingDate: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'houseId', nullable: false })
  houseId: string

  @ManyToOne(() => House, { onDelete: 'CASCADE', nullable: false })
  house: Relation<House>
}
