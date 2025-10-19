import { RefreshToken } from 'src/tokens/entities/refresh-token.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ length: 15 })
  username: string

  @Column()
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.id)
  refreshTokens: Relation<RefreshToken>[]
}
