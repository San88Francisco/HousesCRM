import { Contract } from 'src/contracts/entities/contract.entity'
import type { Relation } from 'typeorm'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Renter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'first_name', length: 15 })
  firstName: string

  @Column({ name: 'last_name', length: 20 })
  lastName: string

  @Column({ type: 'int', default: 25 })
  age: number

  @Column({ type: 'timestamp', nullable: true })
  occupied: Date | null

  @Column({ type: 'timestamp', nullable: true })
  vacated: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Contract, (contract) => contract.renter, { onDelete: 'CASCADE' })
  contracts: Relation<Contract[]>
}
