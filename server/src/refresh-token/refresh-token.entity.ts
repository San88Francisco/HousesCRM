import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ unique: true })
  public token: string

  @Column({ name: 'user_agent' })
  public userAgent: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @Column({ name: 'expires_at' })
  public expiresAt: Date

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE', nullable: false })
  public user: Relation<User>
}
