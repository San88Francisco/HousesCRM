import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ name: 'hashed_token', type: 'varchar', length: 255 })
  public hashedToken: string

  @Index()
  @Column({ type: 'varchar', length: 64 })
  public jti: string

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  public userAgent: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @Column({ name: 'expires_at', type: 'timestamptz' })
  public expiresAt: Date

  @Column({ type: 'boolean', default: false })
  public revoked: boolean

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE', nullable: false })
  public user: Relation<User>
}
