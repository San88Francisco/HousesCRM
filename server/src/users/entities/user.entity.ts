import { Check, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
@Entity()
// eslint-disable-next-line quotes
@Check(`"password" IS NOT NULL OR "google_id" IS NOT NULL`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ length: 50 })
  username: string

  @Column({ nullable: true })
  password?: string

  @Column({ nullable: true, unique: true, name: 'google_id' })
  googleId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
