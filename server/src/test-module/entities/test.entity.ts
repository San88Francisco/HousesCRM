import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  public id: string

  @Column()
  public name: string
}
