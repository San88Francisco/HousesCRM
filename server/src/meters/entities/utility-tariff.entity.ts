import { decimalTransformer } from 'src/common/utils/decimal.transformer'
import { User } from 'src/users/entities/user.entity'
import type { Relation } from 'typeorm'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { UtilityType } from './utility-type.enum'

@Entity()
@Unique(['userId', 'utilityType', 'validFrom'])
export class UtilityTariff {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'utility_type', type: 'enum', enum: UtilityType, default: UtilityType.ELECTRICITY })
  utilityType: UtilityType

  @Column({
    name: 'price_per_unit',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
    transformer: decimalTransformer,
  })
  pricePerUnit: number

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'userId', nullable: false })
  userId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: Relation<User>
}
