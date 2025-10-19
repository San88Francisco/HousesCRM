import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'hashed_token', type: 'varchar', length: 255 })
  hashedToken: string

  @Index()
  @Column({ type: 'varchar', length: 64 })
  jti: string

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  userAgent: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date

  @Column({ type: 'boolean', default: false })
  revoked: boolean

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE', nullable: false })
  user: Relation<User>
}
