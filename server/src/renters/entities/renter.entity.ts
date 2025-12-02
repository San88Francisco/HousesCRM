import { Contract } from 'src/contracts/entities/contract.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class Renter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'first_name', length: 15 })
  firstName: string

  @Column({ name: 'last_name', length: 20 })
  lastName: string

  @Column()
  occupied: Date

  @Column({ nullable: true })
  vacated: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Contract, (contract) => contract.renter, { onDelete: 'CASCADE' })
  contracts: Relation<Contract[]>
}
