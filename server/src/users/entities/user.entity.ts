import { Check, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
@Entity()
// eslint-disable-next-line quotes
@Check(`"password" IS NOT NULL OR "google_id" IS NOT NULL`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ unique: true })
  public email: string

  @Column({ length: 50 })
  public username: string

  @Column({ nullable: true })
  public password?: string

  @Column({ nullable: true, unique: true, name: 'google_id' })
  public googleId?: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date
}
