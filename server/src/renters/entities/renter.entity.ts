import { Contract } from 'src/contracts/entities/contract.entity'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import type { Relation } from 'typeorm'

@Entity()
export class Renter {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ name: 'first_name', length: 15 })
  public firstName: string

  @Column({ name: 'last_name', length: 20 })
  public lastName: string

  @Column()
  public occupied: Date

  @Column({ nullable: true })
  public vacated: Date

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date

  @OneToMany(() => Contract, (contract) => contract.renter, { onDelete: 'CASCADE' })
  public contracts: Relation<Contract[]>
}
