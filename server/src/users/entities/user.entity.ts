import { RefreshToken } from 'src/refresh-token/refresh-token.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ unique: true })
  public email: string

  @Column({ length: 15 })
  public username: string

  @Column()
  public password: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  public refreshTokens: Relation<RefreshToken>[]

  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  public refreshTokenHash: string | null
}
